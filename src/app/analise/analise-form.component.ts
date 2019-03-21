import { Manual } from './../manual/manual.model';
import { ManualContrato } from './../organizacao/ManualContrato.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Response } from '@angular/http';


import { Analise, AnaliseShareEquipe } from './';
import { AnaliseService } from './analise.service';
import { User, UserService } from '../user';
import { ResponseWrapper, AnaliseSharedDataService, PageNotificationService } from '../shared';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { Contrato, ContratoService } from '../contrato';
import { Sistema, SistemaService } from '../sistema';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import * as _ from 'lodash';
import { FatorAjusteLabelGenerator } from '../shared/fator-ajuste-label-generator';
import { TipoEquipeService } from '../tipo-equipe';
import { MessageUtil } from '../util/message.util';
import { FatorAjuste } from '../fator-ajuste';
import { EsforcoFase } from '../esforco-fase';
import { ManualService } from '../manual';

@Component({
    selector: 'jhi-analise-form',
    templateUrl: './analise-form.component.html'
})
export class AnaliseFormComponent implements OnInit, OnDestroy {

    isEdicao: boolean;
    disableFuncaoTrasacao: boolean;
    disableAba: boolean;
    equipeShare; analiseShared: Array<AnaliseShareEquipe> = [];
    selectedEquipes: Array<AnaliseShareEquipe>;
    selectedToDelete: AnaliseShareEquipe;
    mostrarDialog = false;
    isEdit: boolean;

    isSaving: boolean;
    dataAnalise: any;
    dataHomol: any;
    dataCriacao: any;
    loggedUser: User;
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

    equipeResponsavel: SelectItem[] = [];

    nomeManual = MessageUtil.SELECIONE_CONTRATO;

    manual: Manual;

    manuais: Manual[] = [];

    manuaisCombo: SelectItem[] = [];

    @BlockUI() blockUI: NgBlockUI;

    private fatorAjusteNenhumSelectItem = { label: MessageUtil.NENHUM, value: undefined };

    tiposAnalise: SelectItem[] = [
        { label: MessageUtil.PROJETO_DESENVOLVIMENTO, value: MessageUtil.DESENVOLVIMENTO },
        { label: MessageUtil.PROJETO_MELHORIA, value: MessageUtil.MELHORIA },
        { label: MessageUtil.CONTAGEM_APLICACAO, value: MessageUtil.APLICACAO }
    ];

    metodoContagem: SelectItem[] = [
        { label: MessageUtil.DETALHADA_IFPUG, value: MessageUtil.DETALHADA_IFPUG },
        { label: MessageUtil.INDICATIVA_NESMA, value: MessageUtil.INDICATIVA_NESMA },
        { label: MessageUtil.ESTIMADA_NESMA, value: MessageUtil.ESTIMADA_NESMA }
    ];

    private routeSub: Subscription;
    public hideShowSelectEquipe: boolean;

    constructor(
        private confirmationService: ConfirmationService,
        private router: Router,
        private route: ActivatedRoute,
        private analiseService: AnaliseService,
        private sistemaService: SistemaService,
        private analiseSharedDataService: AnaliseSharedDataService,
        private equipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private userService: UserService,
        private contratoService: ContratoService,
        private manualService: ManualService,
    ) {
    }

    ngOnInit() {
        this.disableAba = true;
        this.validacaoCampos = true;
        this.hideShowSelectEquipe = true;
        this.analiseSharedDataService.init();
        this.isEdicao = false;
        this.isSaving = false;
        this.dataHomol = new Date();
        this.dataCriacao = new Date();
        this.getLoggedUser();
        this.habilitarCamposIniciais();
        this.getAnalise();
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    /**
     * Função para recuperar os dados do usuário logado no momento
     */
    getLoggedUser() {
        this.userService.findCurrentUserActiveOrgs().subscribe(res => {
            this.loggedUser = res;
            this.populateOrgs(res.organizacoes);
        });
    }

    populateOrgs(orgs) {
        this.organizacoes = orgs;
    }

    checkUserAnaliseEquipes() {
        let retorno = false;
        if (this.loggedUser.tipoEquipes) {
            this.loggedUser.tipoEquipes.forEach(equipe => {
                if (equipe.id === this.analise.equipeResponsavel.id) {
                    retorno = true;
                }
            });
        }
        return retorno;
    }

    checkIfUserCanEdit() {
        let retorno = false;
        if (this.loggedUser.tipoEquipes) {
            this.loggedUser.tipoEquipes.forEach(equipe => {
                this.analise.compartilhadas.forEach(compartilhada => {
                    if (equipe.id === compartilhada.equipeId) {
                        if (!compartilhada.viewOnly) {
                            retorno = true;
                        }
                    }
                });
            });
        }
        return retorno;
    }
    /**
     * Obtêm uma análise através do ID
     */
    getAnalise() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEdicao = true;
                this.analiseService.find(params['id']).subscribe(analise => {
                    this.inicializaValoresAposCarregamento(analise);
                    this.analiseSharedDataService.analiseCarregada();
                    this.dataAnalise = this.analise;
                    this.aguardarGarantia = this.analise.baselineImediatamente;
                    this.enviarParaBaseLine = this.analise.enviarBaseline;
                    this.setDataHomologacao();
                    this.setDataOrdemServico();
                    this.diasGarantia = this.getGarantia();
                    this.contratoSelected(this.analise.contrato);
                    this.update();
                });
            } else {
                this.analise = new Analise();
                this.analise.esforcoFases = [];
            }
        });
    }

    /**
     * Método responsável por popular a data de Homologação
     */
    setDataHomologacao() {
        if (this.dataAnalise.dataHomologacao !== null) {
            this.dataHomol.setMonth(Number(this.dataAnalise.dataHomologacao.substring(5, 7)) - 1);
            this.dataHomol.setDate(Number(this.dataAnalise.dataHomologacao.substring(8, 10)));
            this.dataHomol.setFullYear(Number(this.dataAnalise.dataHomologacao.substring(0, 4)));
            this.analise.dataHomologacao = this.dataHomol;
        }
    }

    /**
     * Método responsável por popular a data de Ordem de Servico
     */
    setDataOrdemServico() {
        if (this.dataAnalise.dataCriacaoOrdemServico !== null) {
            this.dataCriacao.setMonth(Number(this.dataAnalise.dataCriacaoOrdemServico.substring(5, 7)) - 1);
            this.dataCriacao.setDate(Number(this.dataAnalise.dataCriacaoOrdemServico.substring(8, 10)));
            this.dataCriacao.setFullYear(Number(this.dataAnalise.dataCriacaoOrdemServico.substring(0, 4)));
            this.analise.dataCriacaoOrdemServico = this.dataCriacao;
        }
    }

    /**
     * Método responsável por popular os dias de garantia do contrato
     */
    getGarantia(): any {
        this.diasGarantia = this.diasGarantia !== undefined ? this.analise.contrato.diasDeGarantia : undefined;
    }

    /**
     * Carrega os dados da analise, organização e manual
     */
    private inicializaValoresAposCarregamento(analiseCarregada: Analise) {
        if (analiseCarregada.bloqueiaAnalise) {
            this.pageNotificationService.addErrorMsg(MessageUtil.EDITAR_ANALISE_BLOQUEADA);
            this.router.navigate(['/analise']);
        }
        this.analise = analiseCarregada;
        if (!this.checkIfUserCanEdit() && !this.checkUserAnaliseEquipes()) {
            this.pageNotificationService
                .addErrorMsg('Você não tem permissão para editar esta análise, redirecionando para a tela de visualização...');
            this.router.navigate([`/analise/${analiseCarregada.id}/view`]);
        }
        this.setSistemaOrganizacao(analiseCarregada.organizacao);
        if (analiseCarregada.contrato != undefined && analiseCarregada.contrato.manualContrato)
            this.setManual(
                analiseCarregada.manual ? analiseCarregada.manual : new Manual());
        this.carregaFatorAjusteNaEdicao();
        this.isEdit = this.analise.identificadorAnalise == undefined ? true : false;
    }

    /**
     * Retorna o sistema selecionado
     */
    getSistemaSelecionado() {
        this.analiseSharedDataService.sistemaSelecionado();
    }

    /**
     * Método responsável por popular a lista de sistemas da organização selecionada.
     */
    setSistemaOrganizacao(org: Organizacao) {
        if (!this.isEdicao) {
            this.analise.sistema = undefined;
            this.analise.equipeResponsavel = undefined;
        };
        this.contratoService.findAllContratoesByOrganization(org).subscribe((contracts) => {
            this.contratos = contracts;
        })
        this.sistemaService.findAllSystemOrg(org.id).subscribe((res: ResponseWrapper) => {
            this.sistemas = res.json;
        });
        this.setEquipeOrganizacao(org);
    }

    /**
     * Método responsável por popular a equipe responsavel da organização
     */
    setEquipeOrganizacao(org: Organizacao) {
        this.equipeService.findAllEquipesByOrganizacaoIdAndLoggedUser(org.id).subscribe((res: ResponseWrapper) => {
            this.equipeResponsavel = res.json;
            if (this.equipeResponsavel !== null) {
                this.hideShowSelectEquipe = false;
            }
        });
    }

    /**
     * Método responsável por popular o manual do contrato
     */
    setManual(manual1: Manual) {
        if (manual1) {
            this.manualService.find(manual1.id).subscribe((manual) => {
                this.nomeManual = manual.nome;
                this.carregarEsforcoFases(manual);
                this.carregarMetodosContagem(manual);
                this.inicializaFatoresAjuste(manual);
                this.manualSelecionado(manual);
            });
        }
    }

    /**
     * Método responsável por popular os fatores de ajuste do Manual
     */
    private inicializaFatoresAjuste(manual: Manual) {
        this.fatoresAjuste = [];
        if (manual.fatoresAjuste) {
            const faS: FatorAjuste[] = _.cloneDeep(manual.fatoresAjuste);
            this.fatoresAjuste =
                faS.map(fa => {
                    const label = FatorAjusteLabelGenerator.generate(fa);
                    return { label: label, value: fa };
                });
            this.fatoresAjuste.unshift(this.fatorAjusteNenhumSelectItem);
        }
    }

    /**
     * Método responsável por popular os fatores de ajuste do Manual na Edicao
     */
    private carregaFatorAjusteNaEdicao() {
        const fatorAjuste: FatorAjuste = this.analise.fatorAjuste;
        if (fatorAjuste) {
            const fatorAjusteSelectItem: SelectItem
                = _.find(this.fatoresAjuste, { value: { id: fatorAjuste.id } });
            this.analise.fatorAjuste = fatorAjusteSelectItem.value;
        }
    }

    /**
     *  Método responsável por popular os Esforços de fases
     */
    private carregarEsforcoFases(manual: Manual) {
        this.esforcoFases = _.cloneDeep(manual.esforcoFases);

        if (!this.isEdicao) {
            // Traz todos esforcos de fases selecionados
            this.analise.esforcoFases = _.cloneDeep(manual.esforcoFases);
        }
    }

    /**
     *  Método responsável por os metodos de contagem
     */
    private carregarMetodosContagem(manual: Manual) {
        this.metodosContagem = [
            {
                value: MessageUtil.DETALHADA,
                label: MessageUtil.DETALHADA_IFPUG
            },
            {
                value: MessageUtil.INDICATIVA,
                label: this.getLabelValorVariacao(MessageUtil.INDICATIVA_NESMA, manual.valorVariacaoIndicativa)
            },
            {
                value: MessageUtil.ESTIMADA,
                label: this.getLabelValorVariacao(MessageUtil.ESTIMADA_NESMA, manual.valorVariacaoEstimada)
            }
        ];
    }

    /**
     * Atribui o rótulo para o valor de Variação
     */
    private getLabelValorVariacao(label: string, valorVariacao: number): string {
        return label + ' - ' + valorVariacao.toLocaleString() + '%';
    }

    /**
     * Obtem o esforço de fase
     */
    totalEsforcoFases() {
        const initialValue = 0;
        if (this.analise.esforcoFases) {
            return this.analise.esforcoFases
                .reduce((val, ef) => val + ef.esforco, initialValue);
        }
        return initialValue;
    }

    /**
     * Descrição do valor esperado no campo de entrada: Sistema
     */
    sistemaDropdownPlaceholder() {
        if (this.sistemas) {
            if (this.sistemas.length > 0) {
                return MessageUtil.SELECIONE;
            } else {
                return MessageUtil.ORGANIZACAO_SEM_SISTEMA;
            }
        } else {
            return MessageUtil.SELECIONE_ORGANIZACAO;
        }
    }

    /**
     * Gera o relatório detalhado PDF.
     * @param analise
     */
    public geraRelatorioPdfDetalhadoBrowser() {
        this.analiseService.geraRelatorioPdfDetalhadoBrowser(this.analise.id);
    }

    /**
     * Bloqueia a análise aberta atualmente.
     *
     */
    public bloquearAnalise() {
        if (!this.analise.dataHomologacao) {
            this.pageNotificationService.addInfoMsg(MessageUtil.INFORME_DATA_HOMOLOGACAO);
        }

        if (this.analise.dataHomologacao) {
            this.confirmationService.confirm({
                message: MessageUtil.CONFIRMAR_BLOQUEIO.concat(this.analise.identificadorAnalise).concat('?'),
                accept: () => {
                    const copy = this.analise.toJSONState();
                    this.analiseService.block(copy).subscribe(() => {
                        this.pageNotificationService.addBlockMsgWithName(this.analise.identificadorAnalise);
                        this.router.navigate(['analise/']);
                    }, (error: Response) => {
                        switch (error.status) {
                            case 400: {
                                if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.notadmin') {
                                    this.pageNotificationService.addErrorMsg('Somente administradores podem bloquear/desbloquear análises!');
                                } else {
                                    this.pageNotificationService
                                        .addErrorMsg('Somente membros da equipe responsável podem bloquear esta análise!');
                                }
                            }
                        }
                    });
                }
            });
        }

    }


    /**
     * Atuva ou desativa o Dropdown de sistema (html)
     * */
    disabledSistemaDropdown() {
        return this.sistemas && this.sistemas.length > 0;
    }

    /**
     * Atuva ou desativa a tab Funcao de Transação
     */
    // disabledFuncaoTransacao() {
    //     this.disableFuncaoTrasacao = this.analise.metodoContagem !== MessageUtil.INDICATIVA;
    // }

    /**
     * Verifica se algum contrato foi selecioando
     *
     */
    isContratoSelected(): boolean {
        return this.analiseSharedDataService.isContratoSelected();
    }

    /**
     * Atribui a instrução no campo  Deflator e Método de Contagem
     */
    needContratoDropdownPlaceholder() {
        if (this.isContratoSelected()) {
            return MessageUtil.SELECIONE;
        } else {
            return MessageUtil.SELECIONE_CONTRATO;
        }
    }

    /**
     *
     * Salva o contrato selecionado
     * @param contrato
     */
    contratoSelected(contrato: Contrato) {
        if (contrato.manualContrato) {
            this.setManuais(contrato);
            var manualSelected = (typeof this.analise.manual.id !== "undefined") ? this.analise.manual : contrato.manualContrato[0].manual;
            this.setManual(manualSelected);
            this.analise.manual = manualSelected;
            this.diasGarantia = this.analise.contrato.diasDeGarantia;
            this.carregarMetodosContagem(manualSelected)
            //this.analise.baselineImediatamente = true;
            //this.analise.enviarBaseline = true;
        }
    }

    setManuais(contrato: Contrato) {
        contrato.manualContrato.forEach(item => {
            //Método provisorio, deve ser iniciado durante a desserialização
            item.dataInicioVigencia = new Date(item.dataInicioVigencia)
            item.dataFimVigencia = new Date(item.dataFimVigencia)
        });

        contrato.manualContrato = contrato.manualContrato.sort((a, b): number => {
            if ((a.dataInicioVigencia.getTime() == b.dataInicioVigencia.getTime())) {
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
        });


        this.resetManuais();
        contrato.manualContrato.forEach((item: ManualContrato) => {

            const entity: Manual = new Manual();
            let m: Manual = entity.copyFromJSON(item.manual);

            this.manuais.push(item.manual);
            this.manuaisCombo.push({
                label: m.nome,
                value: m.id == this.analise.manual.id ? this.analise.manual : m
            });

        });
    }


    resetManuais() {
        this.manuais = [];
        this.manuaisCombo = [];
    }

    manualSelecionado(manual: Manual) {
        this.analise.esforcoFases = _.cloneDeep(manual.esforcoFases);
    }

    /**
     * Método responsável por persistir as informações das análises na edição.
     **/
    save() {
        // if (!this.aguardarGarantia) {
        //     this.analise.baselineImediatamente = true;
        // }
        if (!this.enviarParaBaseLine) {
            this.analise.enviarBaseline = true;
        }
        this.validaCamposObrigatorios();
        if (this.verificarCamposObrigatorios()) {
            this.analiseService.update(this.analise).subscribe(() => {
                this.pageNotificationService.addSuccessMsg(this.isEdit ? 'Registro salvo com sucesso!' : 'Dados alterados com sucesso!');
                this.diasGarantia = this.analise.contrato.diasDeGarantia;
            });
        }
    }

    update() {
        this.validaCamposObrigatorios();
        if (this.verificarCamposObrigatorios()) {
            this.analiseService.update(this.analise).subscribe();
            this.diasGarantia = this.analise.contrato.diasDeGarantia;
        }
    }

    private validaCamposObrigatorios() {
        const validacaoIdentificadorAnalise = this.analise.identificadorAnalise ? true : false;
        const validacaoContrato = this.analise.contrato ? true : false;
        const validacaoMetodoContagem = this.analise.metodoContagem ? true : false;
        const validacaoTipoAnallise = this.analise.tipoAnalise ? true : false;

        this.validacaoCampos = !(validacaoIdentificadorAnalise === true
            && validacaoContrato === true
            && validacaoMetodoContagem === true
            && validacaoTipoAnallise === true);

        this.enableDisableAba();
    }

    enableDisableAba() {
        if (this.validacaoCampos === false) {
            this.disableAba = false;
            this.disableFuncaoTrasacao = this.analise.metodoContagem !== MessageUtil.INDICATIVA;
        }
    }

    /**
     * Método responsável por validar campos obrigatórios na persistência.
     **/
    private verificarCamposObrigatorios(): boolean {
        let isValid = true;

        if (!this.analise.identificadorAnalise) {
            this.pageNotificationService.addInfoMsg(MessageUtil.INFORME_IDENTIFICADOR);
            isValid = false;
            return isValid;
        }
        if (!this.analise.contrato) {
            this.pageNotificationService.addInfoMsg(MessageUtil.SELECIONE_CONTRATO_CONTINUAR);
            isValid = false;
            return isValid;
        }
        if (!this.analise.dataCriacaoOrdemServico) {
            this.pageNotificationService.addInfoMsg(MessageUtil.INFORME_DATA_ORDEM_SERVICO);
            isValid = false;
            return isValid;
        }
        if (!this.analise.metodoContagem) {
            this.pageNotificationService.addInfoMsg(MessageUtil.INFORME_METODO_CONTAGEM);
            isValid = false;
            return isValid;
        }
        if (!this.analise.tipoAnalise) {
            this.pageNotificationService.addInfoMsg(MessageUtil.INFORME_TIPO_CONTAGEM);
            isValid = false;
            return isValid;
        }

        return isValid;
    }

    /**
     * Habilita ou Desabilita campos na aba Geral da análise
     */
    public habilitarCamposIniciais() {
        return this.isEdicao;
    }

    /**
     * Retorna o nome do Sistema
     */
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

    public openCompartilharDialog() {
        if (this.checkUserAnaliseEquipes()) {
            this.equipeShare = [];
            this.equipeService.findAllCompartilhaveis(this.analise.organizacao.id,
                this.analise.id,
                this.analise.equipeResponsavel.id).subscribe((equipes) => {
                    if (equipes.json) {
                        equipes.json.forEach((equipe) => {
                            const entity: AnaliseShareEquipe = Object.assign(new AnaliseShareEquipe(),
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
                    this.blockUI.stop();
                });
            this.analiseService.findAllCompartilhadaByAnalise(this.analise.id).subscribe((shared) => {
                this.analiseShared = shared.json;
            });
            this.mostrarDialog = true;
        } else {
            this.pageNotificationService.addErrorMsg('Somente membros da equipe responsável podem compartilhar esta análise!');
        }
    }

    public salvarCompartilhar() {
        if (this.selectedEquipes && this.selectedEquipes.length !== 0) {
            this.analiseService.salvarCompartilhar(this.selectedEquipes).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMsg('Análise compartilhada com sucesso!');
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMsg('Selecione pelo menos um registro para poder adicionar ou clique no X para sair!');
        }

    }

    public deletarCompartilhar() {
        if (this.selectedToDelete && this.selectedToDelete !== null) {
            this.analiseService.deletarCompartilhar(this.selectedToDelete.id).subscribe((res) => {
                this.mostrarDialog = false;
                this.pageNotificationService.addSuccessMsg('Compartilhamento removido com sucesso!');
                this.limparSelecaoCompartilhar();
            });
        } else {
            this.pageNotificationService.addInfoMsg('Selecione pelo menos um registro para poder remover ou clique no X para sair!');
        }
    }

    public limparSelecaoCompartilhar() {
        this.getAnalise();
        this.selectedEquipes = undefined;
        this.selectedToDelete = undefined;
    }

    public updateViewOnly() {
        setTimeout(() => {
            this.analiseService.atualizarCompartilhar(this.selectedToDelete).subscribe((res) => {
                this.pageNotificationService.addSuccessMsg('Registro atualizado com sucesso!');
            });
        }, 250);
    }
}

