import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AnaliseShareEquipe } from '../analise-share-equipe.model';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { Contrato, ContratoService } from 'src/app/contrato';
import { Sistema, SistemaService } from 'src/app/sistema';
import { EsforcoFase } from 'src/app/esforco-fase';
import { SelectItem, ConfirmationService } from 'primeng';
import { Manual } from 'src/app/manual';
import { Subscription } from 'rxjs';
import { AnaliseService } from '../analise.service';
import { PageNotificationService } from '@nuvem/primeng-components';
import { UserService } from 'src/app/user';
import { Analise } from '../analise.model';
import { AnaliseSharedDataService } from 'src/app/shared/analise-shared-data.service';
import { FatorAjuste } from 'src/app/fator-ajuste';
import { FatorAjusteLabelGenerator } from 'src/app/shared/fator-ajuste-label-generator';
import { MessageUtil } from 'src/app/util/message.util';


@Component({
    selector: 'app-analise-view',
    templateUrl: './analise-view.component.html'
})
export class AnaliseViewComponent implements OnInit {

    isEdicao: boolean;
    isView: boolean;
    disableFuncaoTrasacao: boolean;
    disableAba: boolean;

    isSaving: boolean;
    dataAnalise: any;
    dataHomol: any;
    diasGarantia: number;
    public validacaoCampos: boolean;
    equipeShare; analiseShared: Array<AnaliseShareEquipe> = [];
    selectedEquipes: Array<AnaliseShareEquipe>;
    selectedToDelete: AnaliseShareEquipe;
    mostrarDialog = false;
    tipoEquipesLoggedUser: TipoEquipe[] = [];
    dataCriacao: any;

    organizacoes: Organizacao[];

    contratos: Contrato[];

    sistemas: Sistema[];

    esforcoFases: EsforcoFase[] = [];

    metodosContagem: SelectItem[] = [];

    fatoresAjuste: SelectItem[] = [];

    equipeResponsavel: TipoEquipe[] = [];

    manual: Manual;

    nomeManual = this.getLabel('Analise.SelecioneUmContrato');

    private fatorAjusteNenhumSelectItem = {
        label: MessageUtil.NENHUM, value: undefined
    };


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
    private urlSub: Subscription;
    private url: string;
    public hideShowSelectEquipe: boolean;

    constructor(
        private confirmationService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private analiseService: AnaliseService,
        private organizacaoService: OrganizacaoService,
        private contratoService: ContratoService,
        private sistemaService: SistemaService,
        private analiseSharedDataService: AnaliseSharedDataService,
        private equipeService: TipoEquipeService,
        private pageNotificationService: PageNotificationService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.disableAba = false;
        this.validacaoCampos = false;
        this.hideShowSelectEquipe = true;
        this.analiseSharedDataService.init();
        this.isEdicao = false;
        this.isView = true;
        this.isSaving = false;
        this.dataHomol = new Date();
        this.dataCriacao = new Date();
        this.getEquipesFromActiveLoggedUser();
        this.habilitarCamposIniciais();
        this.listOrganizacoes();
        this.getAnalise();
        this.traduzirtiposAnalise();
    }

    getLabel(label) {
        return label;
    }

    getEquipesFromActiveLoggedUser() {
        this.equipeService.getEquipesActiveLoggedUser().subscribe(res => {
            this.tipoEquipesLoggedUser = res;
        });
    }

    getAnalise() {
        this.routeSub = this.route.params.subscribe(params => {
            this.analise = new Analise();
            if (params['id']) {
                this.isEdicao = true;
                this.analiseService.findView(params['id']).subscribe(analise => {
                    this.inicializaValoresAposCarregamento(analise);
                    this.analiseSharedDataService.analiseCarregada();
                    this.dataAnalise = this.analise;
                    this.setData(this.analise.dataHomologacao);
                    this.setData(this.analise.dataCriacaoOrdemServico);
                    this.diasGarantia = this.getGarantia();
                });
            } else {
                this.analise.esforcoFases = [];
            }
        });
    }

    traduzirtiposAnalise() {
        // this.translate.stream(['Analise.Analise.TiposAnalise.ProjetoDesenvolvimento', 'Analise.Analise.TiposAnalise.ProjetoMelhoria',
        //     'Analise.Analise.TiposAnalise.ContagemAplicacao']).subscribe((traducao) => {
        //     this.tiposAnalise = [
        //         {label: traducao['Analise.Analise.TiposAnalise.ProjetoDesenvolvimento'], value: 'DESENVOLVIMENTO'},
        //         {label: traducao['Analise.Analise.TiposAnalise.ProjetoMelhoria'], value: 'MELHORIA'},
        //         {label: traducao['Analise.Analise.TiposAnalise.ContagemAplicacao'], value: 'APLICACAO'}
        //     ];

        // });
    }

    setData(data) {
        if (data !== null) {
            this.dataHomol.setMonth(Number(data.substring(5, 7)) - 1);
            this.dataHomol.setDate(Number(data.substring(8, 10)));
            this.dataHomol.setFullYear(Number(data.substring(0, 4)));
            this.analise.dataHomologacao = this.dataHomol;
        }
    }

    getGarantia(): any {
        if (this.diasGarantia !== undefined) {
            this.diasGarantia = this.analise.contrato.diasDeGarantia;
        }
    }

    listOrganizacoes() {
        this.organizacaoService.searchActiveOrganizations().subscribe((res) => {
            this.organizacoes = res.json;
        }, (error: Response) => {
            this.pageNotificationService.addErrorMessage(this.getLabel('Ocorreu algum erro'));
        });
    }

    private inicializaValoresAposCarregamento(analiseCarregada: Analise) {
        if (!this.isView && analiseCarregada.bloqueiaAnalise) {
            this.pageNotificationService.addErrorMessage(this.getLabel('Você não pode editar uma análise bloqueada!'));
            this.router.navigate(['/analise']);
        }
        this.analise = analiseCarregada;
        this.setSistamaOrganizacao(analiseCarregada.organizacao);
        this.setManual(analiseCarregada.manual);
        this.carregaFatorAjusteNaEdicao();
    }

    getSistemaSelecionado() {
        this.analiseSharedDataService.sistemaSelecionado();
    }

    setSistamaOrganizacao(org: Organizacao) {
        this.contratos = org.contracts;
        this.sistemaService.findAllSystemOrg(org.id).subscribe((res: Sistema[]) => {
            this.sistemas = res;
        });
        this.setEquipeOrganizacao(org);
    }

    setEquipeOrganizacao(org: Organizacao) {
        this.contratos = org.contracts;
        this.equipeService.findAllByOrganizacaoId(org.id).subscribe((res: TipoEquipe[]) => {
            this.equipeResponsavel = res;
            if (this.equipeResponsavel !== null) {
                this.hideShowSelectEquipe = false;
            }
        });
    }

    setManual(manual: Manual) {
        if (manual) {
            this.nomeManual = manual.nome;
            this.carregarEsforcoFases(manual);
            this.carregarMetodosContagem(manual);
            this.inicializaFatoresAjuste(manual);
        }
    }

    private inicializaFatoresAjuste(manual: Manual) {
        // const faS: FatorAjuste[] = _.cloneDeep(manual.fatoresAjuste);
        // this.fatoresAjuste =
        //     faS.map(fa => {
        //         const label = FatorAjusteLabelGenerator.generate(fa);
        //         return {label: label, value: fa};
        //     });
        this.fatoresAjuste.push(this.fatorAjusteNenhumSelectItem);
    }

    private carregaFatorAjusteNaEdicao() {
        const fatorAjuste: FatorAjuste = this.analise.fatorAjuste;
        if (fatorAjuste) {
            // const fatorAjusteSelectItem: SelectItem
            //     = _.find(this.fatoresAjuste, {value: {id: fatorAjuste.id}});
            // this.analise.fatorAjuste = fatorAjusteSelectItem.value;
        }
    }

    private carregarEsforcoFases(manual: Manual) {
        // this.esforcoFases = _.cloneDeep(manual.esforcoFases);

        if (!this.isEdicao) {
            // Traz todos esforcos de fases selecionados
            // this.analise.esforcoFases = _.cloneDeep(manual.esforcoFases);
        }
    }

    private carregarMetodosContagem(manual: Manual) {
        this.metodosContagem = [
            {
                value: MessageUtil.DETALHADA,
                label: this.getLabel('DETALHADA_IFPUG')
            },
            {
                value: MessageUtil.INDICATIVA,
                label: this.getLabelValorVariacao(
                    this.getLabel('INDICATIVA_NESMA'),
                    manual.valorVariacaoIndicativaFormatado)
            },
            {
                value: MessageUtil.ESTIMADA,
                label: this.getLabelValorVariacao(
                    this.getLabel('ESTIMADA_NESMA'),
                    manual.valorVariacaoEstimadaFormatado)
            }
        ];
    }

    private getLabelValorVariacao(label: string, valorVariacao: number): string {
        return label + ' - ' + valorVariacao + '%';
    }

    totalEsforcoFases() {
        const initialValue = 0;
        if (this.analise && this.analise.esforcoFases) {
            return this.analise.esforcoFases.reduce((val, ef) => val + ef.esforcoFormatado, initialValue);
        }
    }

    sistemaDropdownPlaceholder() {
        if (this.sistemas) {
            if (this.sistemas.length > 0) {
                return this.getLabel('Selecione');
            } else {
                return this.getLabel('Selecione uma Organização');
            }
        } else {
            return this.getLabel('Organização não possui nenhum Sistema cadastrado');
        }
    }

    disabledSistemaDropdown() {
        return this.sistemas && this.sistemas.length > 0;
    }

    isContratoSelected(): boolean {
        return this.analiseSharedDataService.isContratoSelected();
    }

    needContratoDropdownPlaceholder() {
        if (this.isContratoSelected()) {
            return this.getLabel('Selecione ');
        } else {
            return this.getLabel('Selecione um Contrato');
        }
    }

    contratoSelected(contrato: Contrato) {
        this.setManual(this.analise.manual);
    }


    public habilitarCamposIniciais() {
        return this.isEdicao;
    }

    public nomeSistema(): string {
        return this.analise.sistema.sigla +
            ' - ' + this.analise.sistema.nome;
    }

    get analise(): Analise {
        return this.analiseSharedDataService.analise;
    }

    set analise(analise: Analise) {
        this.analiseSharedDataService.analise = analise;
    }

    public geraRelatorioPdfDetalhadoBrowser() {
        this.analiseService.geraRelatorioPdfDetalhadoBrowser(this.analise.id);
    }

    public desbloquearAnalise() {
        if (this.checkUserAnaliseEquipes()) {
            this.confirmationService.confirm({
                message: this.getLabel('Tem certeza que deseja desbloquear o registro ')
                            .concat(this.analise.identificadorAnalise).concat('?'),
                accept: () => {
                    const copy = this.analise.toJSONState();
                    this.analiseService.block(copy).subscribe(() => {
                        this.pageNotificationService.addSuccessMessage(this.analise.identificadorAnalise);
                        this.router.navigate(['/analise']);
                    }, (error: Response) => {
                        switch (error.status) {
                            case 400: {
                                if (error.headers['x-abacoapp-error'][0] === 'error.notadmin') {
                                    this.pageNotificationService.addErrorMessage(
                                        this.getLabel('Somente administradores podem bloquear/desbloquear análises!')
                                    );
                                }
                            }
                        }
                    });
                }
            });
        } else {
            this.pageNotificationService.addErrorMessage(this.getLabel('Somente administradores podem bloquear/desbloquear análises!'));
        }
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

    public openCompartilharDialog() {
        if (this.checkUserAnaliseEquipes()) {
            this.equipeShare = [];
            this.equipeService.findAllCompartilhaveis(
                    this.analise.organizacao.id,
                    this.analise.id,
                    this.analise.equipeResponsavel.id).subscribe((equipes) => {
                if (equipes) {
                    equipes.forEach((equipe) => {
                        const entity: AnaliseShareEquipe = Object.assign(new AnaliseShareEquipe(), {
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
            this.analiseService.findAllCompartilhadaByAnalise(this.analise.id).subscribe((shared) => {
                this.analiseShared = shared;
            });
            this.mostrarDialog = true;
        } else {
            this.pageNotificationService.addErrorMessage(this.getLabel('Somente membros da equipe responsável podem compartilhar esta análise!'));
        }
    }

    public limparSelecaoCompartilhar() {
        this.getAnalise();
        this.selectedEquipes = undefined;
        this.selectedToDelete = undefined;
    }

    public salvarCompartilhar() {
        if (this.selectedEquipes && this.selectedEquipes.length !== 0) {
            this.analiseService.salvarCompartilhar(this.selectedEquipes).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMessage(this.getLabel('Análise compartilhada com sucesso!'));
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMessage(this.getLabel('Selecione pelo menos um registro para poder adicionar ou clique no X para sair!'));
        }

    }

    public deletarCompartilhar() {
        if (this.selectedToDelete && this.selectedToDelete !== null) {
            this.analiseService.deletarCompartilhar(this.selectedToDelete.id).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMessage(this.getLabel('Compartilhamento removido com sucesso!'));
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMessage(this.getLabel('Selecione pelo menos um registro para poder remover ou clique no X para sair!'));
        }
    }

    public updateViewOnly() {
        setTimeout(() => {
            this.analiseService.atualizarCompartilhar(this.selectedToDelete).subscribe((res) => {
                this.pageNotificationService.addSuccessMessage(this.getLabel('msgRegistroAtualizadoSucesso'));
            });
        }, 250);
    }
    handleChange(e) {
        const index = e.index;
        let link;
        switch (index) {
            case 0:
                return;
            case 1:
                link = ['/analise/' + this.analise.id + '/funcao-dados/view'];
                break;
            case 2:
                link = ['/analise/' + this.analise.id + '/funcao-transacao/view'];
                break;
            case 3:
                link = ['/analise/' + this.analise.id + '/resumo/view'];
                break;
        }
        this.router.navigate(link);
    }
}

