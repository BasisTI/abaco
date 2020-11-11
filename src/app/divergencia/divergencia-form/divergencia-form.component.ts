import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import { OnInit, Component } from '@angular/core';
import { User, UserService } from '../../user';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { Contrato, ContratoService } from 'src/app/contrato';
import { Sistema, SistemaService } from 'src/app/sistema';
import { EsforcoFase } from 'src/app/esforco-fase';
import { SelectItem, ConfirmationService } from 'primeng';
import { Manual, ManualService } from 'src/app/manual';
import { MessageUtil } from 'src/app/util/message.util';
import { Subscription, Observable } from 'rxjs';
import { AnaliseSharedDataService } from 'src/app/shared/analise-shared-data.service';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Divergencia, MetodoContagem } from '..';
import { ManualContrato } from 'src/app/organizacao/ManualContrato.model';
import { FatorAjuste } from 'src/app/fator-ajuste';
import { FatorAjusteLabelGenerator } from 'src/app/shared/fator-ajuste-label-generator';
import { FuncaoDados } from '../../funcao-dados';
import { DivergenciaService } from '../divergencia.service';
import { StatusService } from 'src/app/status';
import { Status } from 'src/app/status/status.model';


@Component({
    selector: 'app-divergencia-form',
    templateUrl: './divergencia-form.component.html',
    providers: [ConfirmationService, AnaliseSharedDataService]
})
export class DivergenciaFormComponent implements OnInit {

    isEdicao: boolean;
    canEditMetodo = false ;
    disableFuncaoTrasacao = true;
    disableAba: boolean;
    equipeShare = [];
    mostrarDialog = false;
    isEdit: boolean;
    isSaving: boolean;
    dataAnalise: any;
    dataHomologacao: any;
    dataCriacao: any;
    loggedUser: User;
    tipoEquipesLoggedUser: TipoEquipe[] = [];
    diasGarantia: number;
    public validacaoCampos: boolean;
    aguardarGarantia: boolean;
    enviarParaBaseLine: boolean;
    organizacoes: Organizacao[];
    contratos: Contrato[];
    sistemas: Sistema[];
    esforcoFases: EsforcoFase[] = [];
    metodosContagem: SelectItem[] = [];
    fatoresAjuste: SelectItem[] = [];
    equipeResponsavel: TipoEquipe[] = [];
    lstfuncaoDadosDto: FuncaoDados[];
    nomeManual = this.getLabel('Selecione um contrato');
    manual: Manual;
    manuais: Manual[] = [];
    users: User[] = [];
    usersDropDown: User[] = [];
    manuaisCombo: SelectItem[] = [];
    statusCombo: Status[] = [];
    showFuncaoDados: Boolean = false;
    analise = new Divergencia();
    usuariosOptions: User[] = [];


    tiposAnalise: SelectItem[] = [
        {label: MessageUtil.PROJETO_DESENVOLVIMENTO, value: MessageUtil.DESENVOLVIMENTO},
        {label: MessageUtil.PROJETO_MELHORIA, value: MessageUtil.MELHORIA},
        {label: MessageUtil.CONTAGEM_APLICACAO, value: MessageUtil.APLICACAO}
    ];


    metodoContagem: SelectItem[] = [
        {label: MessageUtil.DETALHADA_IFPUG, value: MessageUtil.DETALHADA_IFPUG},
        {label: MessageUtil.INDICATIVA_NESMA, value: MessageUtil.INDICATIVA_NESMA},
        {label: MessageUtil.ESTIMADA_NESMA, value: MessageUtil.ESTIMADA_NESMA}
    ];

    private routeSub: Subscription;
    private subscription: Subscription;
    private saveSubscription: Subscription;
    public hideShowSelectEquipe: boolean;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private analiseService: DivergenciaService,
        private sistemaService: SistemaService,
        private analiseSharedDataService: AnaliseSharedDataService,
        private equipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private userService: UserService,
        private contratoService: ContratoService,
        private manualService: ManualService,
        private statusService: StatusService,
    ) {
    }

    ngOnInit() {
        this.analiseSharedDataService.init();
        this.getAnalise();
    }

    getLabel(label) {
        return label;
    }

    getOrganizationsFromActiveLoggedUser() {
        this.organizacaoService.dropDownActiveLoggedUser().subscribe(res => {
            this.organizacoes = res;
        });
    }

    checkUserAnaliseEquipes() {
        let retorno = false;
        if (this.tipoEquipesLoggedUser) {
            this.tipoEquipesLoggedUser.forEach(equipe => {
                if (equipe.id === this.analise.equipeResponsavel.id) {
                    retorno = true;
                }
            });
        }
        return retorno;
    }
    recuperarUsuarios() {
        this.userService.dropDown().subscribe(response => {
            this.usuariosOptions = this.userService.convertUsersFromServer(response);
        });
    }

    getAnalise() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEdicao = true;
                this.analiseService.find(params['id']).subscribe(analise => {
                    this.analise = analise;
                    },
                    err => {
                        this.pageNotificationService.addErrorMessage(
                            this.getLabel('Você não tem permissão para editar esta análise, redirecionando para a tela de visualização...')
                        );
                        this.router.navigate(['/divergence']);
                    });
            } else {
                this.analise = new Divergencia();
                this.analise.status = new Status();
                this.analise.esforcoFases = [];
                this.analise.enviarBaseline = true;
                this.canEditMetodo = true;
            }
        });
    }

    private verifyCanEditAnalise(analise: Divergencia): Boolean {
        let canEditAnalise: Boolean = false;
        this.tipoEquipesLoggedUser.forEach(equip => {
            if (equip.id === analise.equipeResponsavel.id) {
                canEditAnalise =  true;
            }
        });
        return canEditAnalise;
    }

    setDataHomologacao() {
        if (this.dataAnalise.dataHomologacao !== null) {
            this.dataHomologacao.setMonth(Number(this.dataAnalise.dataHomologacao.substring(5, 7)) - 1);
            this.dataHomologacao.setDate(Number(this.dataAnalise.dataHomologacao.substring(8, 10)));
            this.dataHomologacao.setFullYear(Number(this.dataAnalise.dataHomologacao.substring(0, 4)));
            this.analise.dataHomologacao = this.dataHomologacao;
        }
    }

    setDataOrdemServico() {
        if (this.dataAnalise.dataCriacaoOrdemServico !== null) {
            this.dataCriacao.setMonth(Number(this.dataAnalise.dataCriacaoOrdemServico.substring(5, 7)) - 1);
            this.dataCriacao.setDate(Number(this.dataAnalise.dataCriacaoOrdemServico.substring(8, 10)));
            this.dataCriacao.setFullYear(Number(this.dataAnalise.dataCriacaoOrdemServico.substring(0, 4)));
            this.analise.dataCriacaoOrdemServico = this.dataCriacao;
        }
    }

    getGarantia(): any {
        this.diasGarantia = this.diasGarantia !== undefined ? this.analise.contrato.diasDeGarantia : undefined;
    }

    private inicializaValoresAposCarregamento(analiseCarregada: Divergencia) {
        this.analise = analiseCarregada;
        this.setSistemaOrganizacao(analiseCarregada.organizacao);
        if (analiseCarregada.contrato !== undefined && analiseCarregada.contrato.manualContrato) {
            this.setManual(analiseCarregada.manual ? analiseCarregada.manual : new Manual());
        }
    }

    getSistemaSelecionado() {
        this.analiseSharedDataService.sistemaSelecionado();
    }

    setSistemaOrganizacao(org: Organizacao) {
        if (!this.isEdicao) {
            this.analise = new Divergencia();
            this.analise.manual = new Manual();
            this.analise.organizacao = org;
        }
        this.contratoService.findAllContratoesByOrganization(org).subscribe((contracts) => {
            this.contratos = contracts;
        });
        this.sistemaService.findAllSystemOrg(org.id).subscribe((res: Sistema[]) => {
            this.sistemas = res;
        });
        this.setEquipeOrganizacao(org);
    }

    setEquipeOrganizacao(org: Organizacao) {
        this.equipeService.findAllEquipesByOrganizacaoIdAndLoggedUser(org.id).subscribe((res: TipoEquipe[]) => {
            this.equipeResponsavel = res;
            if (this.equipeResponsavel !== null) {
                this.hideShowSelectEquipe = false;
            }
        });
    }

    setManual(manualSelected: Manual) {
        if (manualSelected) {
            this.manualService.find(manualSelected.id).subscribe((manual) => {
                this.nomeManual = manual.nome;
                this.carregarEsforcoFases(manual);
                this.carregarMetodosContagem(manual);
                this.inicializaFatoresAjuste(manual);
                this.manualSelecionado(manual);
                this.setManuais(this.analise.contrato);
                this.carregaFatorAjusteNaEdicao();
            });
        }
    }

    private inicializaFatoresAjuste(manual: Manual) {
        this.fatoresAjuste = [];
        if (manual.fatoresAjuste) {
            const faS: FatorAjuste[] = _.cloneDeep(manual.fatoresAjuste);
            faS.forEach(fa => {
                const label = FatorAjusteLabelGenerator.generate(fa);
                this.fatoresAjuste.push({label, value: fa});
            });
            this.fatoresAjuste.unshift({label: this.getLabel('Nenhum'), value: null});
        }
    }

    private carregaFatorAjusteNaEdicao() {
        if (this.analise.fatorAjuste) {
            this.analise.fatorAjuste = this.fatoresAjuste.find(
                (f) => f !== null && f.value !== null && f.value.id === this.analise.fatorAjuste.id
            ).value;
        }
    }

    private carregarEsforcoFases(manual: Manual) {
        manual.esforcoFases.forEach(element => {
            this.esforcoFases.push(new EsforcoFase().copyFromJSON(element));
        });

        if (this.isEdicao && !(this.analise.esforcoFases)) {
            // Traz todos esforcos de fases selecionados
            this.analise.esforcoFases = _.cloneDeep(manual.esforcoFases);
        }
    }

    private carregarMetodosContagem(manual: Manual) {
        this.metodosContagem = [
            {
                value: MessageUtil.DETALHADA,
                label: this.getLabel('Detalhada (IFPUG)')
            },
            {
                value: MessageUtil.INDICATIVA,
                label: this.getLabelValorVariacao(
                    this.getLabel('Indicativa (NESMA)'),
                    manual.valorVariacaoIndicativa)
            },
            {
                value: MessageUtil.ESTIMADA,
                label: this.getLabelValorVariacao(
                    this.getLabel('Estimada (NESMA)'),
                    manual.valorVariacaoEstimada)
            }
        ];
    }

    private getLabelValorVariacao(label: string, valorVariacao: number): string {
        return label + ' - ' + valorVariacao.toLocaleString() + '%';
    }

    totalEsforcoFases() {
        const initialValue = 0;
        if (this.analise.esforcoFases) {
            return this.analise.esforcoFases
                .reduce((val, ef) => val + ef.esforco, initialValue);
        }
        return initialValue;
    }

    sistemaDropdownPlaceholder() {
        if (this.sistemas) {
            if (this.sistemas.length > 0) {
                return this.getLabel('Selecione');
            } else {
                return this.getLabel('Organização não possui nenhum Sistema cadastrado');
            }
        } else {
            return this.getLabel('Selecione uma Organização');
        }
    }

    disabledOptionsforEdit() {
        if (this.analise.id && this.analise.id > 0) {
            return true;
        } else {
            return false;
        }
    }
    disabledTipoContagemEdit() {
        if (this.canEditMetodo) {
            return false;
        } else {
            return true;
        }
    }

    isContratoSelected(): boolean {
        return this.analiseSharedDataService.isContratoSelected();
    }

    contratoSelected(contrato: Contrato) {
        if (contrato && contrato.manualContrato) {
            this.setManuais(contrato);
            let manualSelected;
            if ((this.analise.manual) && (typeof this.analise.manual.id !== 'undefined')) {
                manualSelected = this.analise.manual;
            } else {
                manualSelected = contrato.manualContrato[0].manual;
            }
            this.setManual(manualSelected);
            this.analise.manual = manualSelected;
            this.diasGarantia = this.analise.contrato.diasDeGarantia;
            this.carregarMetodosContagem(manualSelected);
        }
    }

    setManuais(contrato: Contrato) {
        contrato.manualContrato.forEach(item => {
            item.dataInicioVigencia = new Date(item.dataInicioVigencia);
            item.dataFimVigencia = new Date(item.dataFimVigencia);
        });

        this.ordenarManuais(contrato);
        this.resetManuais();
        this.populaComboManual(contrato);
    }

    private populaComboManual(contrato: Contrato) {
        contrato.manualContrato.forEach((item: ManualContrato) => {
            const entity: Manual = new Manual();
            const m: Manual = entity.copyFromJSON(item.manual);
            this.manuais.push(item.manual);
            this.manuaisCombo.push({
                label: `${m.nome} ${this.formataData(item.dataInicioVigencia)} - ` +
                    `${this.formataData(item.dataFimVigencia)}`
                    + this.formataBoleano(item.ativo),
                value: this.analise.manual && m.id === this.analise.manual.id ? this.analise.manual : m
            });
        });
    }

    private ordenarManuais(contrato: Contrato) {
        contrato.manualContrato = contrato.manualContrato.sort((a, b): number => {
            if (b.ativo && a.ativo) {

                if ((a.dataInicioVigencia.getTime() === b.dataInicioVigencia.getTime())) {
                    if (a.dataFimVigencia.getTime() < b.dataFimVigencia.getTime()) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
                if (a.dataInicioVigencia.getTime() < b.dataInicioVigencia.getTime()) {
                    return -1;
                }
                return 1;
            } else if (!(a.ativo) && b.ativo) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    resetManuais() {
        this.manuais = [];
        this.manuaisCombo = [];
    }

    manualSelecionado(manual: Manual) {
        this.esforcoFases = _.cloneDeep(manual.esforcoFases);
        if (!this.isEdicao && !(this.analise.esforcoFases)) {
            // Traz todos esforcos de fases selecionados
            this.analise.esforcoFases = _.cloneDeep(manual.esforcoFases);
        }
    }

    private formataData(data: Date): String {
        const dt = `${data.getDay()}/${(data.getMonth() + 1)}/${data.getFullYear()}`;
        return dt;
    }

    private formataBoleano(bool: Boolean): String {
        return bool ? this.getLabel(' Ativo') : this.getLabel(' Inativo');
    }


    enableDisableAba() {
        if (this.validacaoCampos === false) {
            this.disableAba = false;
            this.disableFuncaoTrasacao = this.analise.metodoContagem === MessageUtil.INDICATIVA;
        }
    }

    private verificarCamposObrigatorios(): boolean {
        let isValid = true;
        if (!this.analise.identificadorAnalise) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Informe o campo Identificador da Analise para continuar.'));
            isValid = false;
        }
        if (!this.analise.contrato) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Informe o Contrato para continuar'));
            isValid = false;
        }
        if (!this.analise.dataCriacaoOrdemServico) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Informe a data de criação da ordem de serviço para continuar'));
            isValid = false;
        }
        if (!this.analise.metodoContagem) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Informe o Método de Contagem para continuar'));
            isValid = false;
        }
        if (!this.analise.manual) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Informe o Tipo de Contagem para continuar'));
            isValid = false;
        }
        if (!this.analise.tipoAnalise) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Informe o Tipo de Contagem para continuar'));
            isValid = false;
        }
        if ((!this.analise.users || this.analise.users.length <= 0) && this.analise.id && this.analise.id > 0) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Deve haver ao menos um usuário para continuar'));
            isValid = false;
        }
        if ((!this.analise.esforcoFases || this.analise.esforcoFases.length <= 0) && this.analise.id && this.analise.id > 0) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Deve haver ao menos uma Fase para continuar'));
            isValid = false;
        }
        if (!(this.analise.status && this.analise.status.id)) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Informe o Status da Analise para continuar'));
            isValid = false;
        }
        return isValid;
    }

    public habilitarCamposIniciais() {
        return this.isEdicao;
    }


    public openCompartilharDialog() {
        if (this.checkUserAnaliseEquipes()) {
            this.equipeService.findAllCompartilhaveis(this.analise.organizacao.id,
                this.analise.id,
                this.analise.equipeResponsavel.id).subscribe((equipes) => {
                if (equipes) {
                    equipes.forEach((equipe) => {
                        const entity: Divergencia = Object.assign(new Divergencia,
                            {
                                id: undefined,
                                equipeId: equipe.id,
                                analiseId: this.analise.id,
                                viewOnly: false,
                                nomeEquipe: equipe.nome
                            });
                        this.equipeShare.push(entity);
                    });
                }
            });
            this.mostrarDialog = true;
        } else {
            this.pageNotificationService.addErrorMessage(this.getLabel('Somente membros da equipe responsável podem compartilhar esta análise!'));
        }
    }




    private populaComboUsers() {
        if (this.analise.id) {
            this.userService.getAllUsers(this.analise.organizacao, this.analise.equipeResponsavel).subscribe(usuarios => {
                usuarios.forEach(usuario => {
                    this.usersDropDown.push(new User().copyFromJSON(usuario));
                });
                if (this.users && this.users.length > 0) {
                    this.users = _.clone(this.analise.users);
                    this.users = this.users.concat(this.usersDropDown.filter(user => {
                        return !this.analise.users.some(usuario => user.id === usuario.id);
                    }));
                } else {
                    this.users = this.usersDropDown;
                }
                if (this.analise.users && this.analise.users.length === 0) {
                    const user = _.find(this.users, {id: this.loggedUser});
                    this.analise.users.push(user);
                }
            });
        }
    }

    private subscribeToSaveResponse(result: Observable<any>) {
        this.saveSubscription = result.subscribe((res) => {
            this.analise = res;
            this.pageNotificationService.addSuccessMessage(this.getLabel('Análise salva com sucesso'));
            this.router.navigate(['/analise', this.analise.id, 'edit']);
        });
    }

    alterarMetodoContagem() {
        if (this.isEdicao) {
            if (this.analise.metodoContagem !== MetodoContagem.INDICATIVA) {
                this.analise.funcaoTransacaos = [];
            }
        } else {
            if (this.analise.metodoContagem === MetodoContagem.DETALHADA) {
                this.analise.enviarBaseline = true;
            } else {
                this.analise.enviarBaseline = false;
            }

        }
    }

    private loadDataAnalise(analise: Divergencia) {
        this.inicializaValoresAposCarregamento(analise);
        this.setDataHomologacao();
        this.setDataOrdemServico();
        this.diasGarantia = this.getGarantia();
        this.contratoSelected(this.analise.contrato);
        this.analiseSharedDataService.analiseCarregada();
    }

    handleChange(e) {
        const index = e.index;
        let link;
        switch (index) {
            case 0:
                return;
            case 1:
                link = ['/divergencia/' + this.analise.id + '/funcao-dados'];
                break;
            case 2:
                link = ['/divergencia/' + this.analise.id + '/funcao-transacao'];
                break;
            case 3:
                link = ['/divergencia/' + this.analise.id + '/resumo'];
                break;
        }
        this.router.navigate(link);
    }
}

