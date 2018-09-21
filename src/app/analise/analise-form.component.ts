import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import { Response } from '@angular/http';

import { Analise } from './analise.model';
import {AnaliseService} from './analise.service';
import {ResponseWrapper,  AnaliseSharedDataService, PageNotificationService} from '../shared';
import {Organizacao, OrganizacaoService} from '../organizacao';
import {Contrato, ContratoService} from '../contrato';
import {Sistema, SistemaService} from '../sistema';
import {SelectItem, ConfirmationService} from 'primeng/primeng';

import * as _ from 'lodash';
import {FatorAjusteLabelGenerator} from '../shared/fator-ajuste-label-generator';
import {TipoEquipeService} from '../tipo-equipe';
import {MessageUtil} from '../util/message.util';
import {FatorAjuste} from '../fator-ajuste';
import {EsforcoFase} from '../esforco-fase';
import {Manual} from '../manual';

@Component({
    selector: 'jhi-analise-form',
    templateUrl: './analise-form.component.html'
})
export class AnaliseFormComponent implements OnInit, OnDestroy {

    isEdicao: boolean;
    disableFuncaoTrasacao: boolean;
    disableAba: boolean;

    isSaving: boolean;
    dataAnalise: any;
    dataHomol: any;
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

    private fatorAjusteNenhumSelectItem = {label: MessageUtil.NENHUM, value: undefined};

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
        this.habilitarCamposIniciais();
        this.listOrganizacoes();
        this.getAnalise();
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    /**
     * Obtêm uma análise através do ID
     */
    getAnalise() {
        this.routeSub = this.route.params.subscribe(params => {
            this.analise = new Analise();
            if (params['id']) {
                this.isEdicao = true;
                this.analiseService.find(params['id']).subscribe(analise => {
                    this.inicializaValoresAposCarregamento(analise);
                    this.analiseSharedDataService.analiseCarregada();
                    this.dataAnalise = this.analise;
                    this.aguardarGarantia = this.analise.baselineImediatamente;
                    this.enviarParaBaseLine = this.analise.enviarBaseline;
                    this.setDataHomologacao();
                    this.diasGarantia = this.getGarantia();
                    this.update();
                });
            } else {
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
     * Método responsável por popular os dias de garantia do contrato
     */
    getGarantia(): any {
        this.diasGarantia !== undefined ? this.diasGarantia = this.analise.contrato.diasDeGarantia : undefined;
    }

    /**
     * Método responsável por popular a lista de organizações.
     */
    listOrganizacoes() {
        this.organizacaoService.searchActiveOrganizations().subscribe((res: ResponseWrapper) => {
            this.organizacoes = res.json;
        }, (error: Response) => {
            this.pageNotificationService.addErrorMsg('Ops! Ocorreu algum erro');
        });
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
        this.setSistamaOrganizacao(analiseCarregada.organizacao);
        this.setManual(analiseCarregada.contrato);
        this.carregaFatorAjusteNaEdicao();
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
    setSistamaOrganizacao(org: Organizacao) {
        this.contratos = org.contracts;
        this.sistemaService.findAllSystemOrg(org.id).subscribe((res: ResponseWrapper) => {
            this.sistemas = res.json;
        });
        this.setEquipeOrganizacao(org);
    }

    /**
     * Método responsável por popular a equipe responsavel da organização
     */
    setEquipeOrganizacao(org: Organizacao) {
        this.contratos = org.contracts;
        this.equipeService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
            this.equipeResponsavel = res.json;
            if (this.equipeResponsavel !== null) {
                this.hideShowSelectEquipe = false;
            }
        });
    }

    /**
     * Método responsável por popular o manual do contrato
     */
    setManual(contrato: Contrato) {
        if (contrato && contrato.manual) {
            const manual: Manual = contrato.manual;
            this.nomeManual = manual.nome;
            this.carregarEsforcoFases(manual);
            this.carregarMetodosContagem(manual);
            this.inicializaFatoresAjuste(manual);
        }
    }

    /**
     * Método responsável por popular os fatores de ajuste do Manual
     */
    private inicializaFatoresAjuste(manual: Manual) {
        const faS: FatorAjuste[] = _.cloneDeep(manual.fatoresAjuste);
        this.fatoresAjuste =
            faS.map(fa => {
                const label = FatorAjusteLabelGenerator.generate(fa);
                return {label: label, value: fa};
            });
        this.fatoresAjuste.unshift(this.fatorAjusteNenhumSelectItem);
    }

    /**
     * Método responsável por popular os fatores de ajuste do Manual na Edicao
     */
    private carregaFatorAjusteNaEdicao() {
        const fatorAjuste: FatorAjuste = this.analise.fatorAjuste;
        if (fatorAjuste) {
            const fatorAjusteSelectItem: SelectItem
                = _.find(this.fatoresAjuste, {value: {id: fatorAjuste.id}});
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
                label: this.getLabelValorVariacao(MessageUtil.INDICATIVA_NESMA, manual.valorVariacaoIndicativaFormatado)
            },
            {
                value: MessageUtil.ESTIMADA,
                label: this.getLabelValorVariacao(MessageUtil.ESTIMADA_NESMA, manual.valorVariacaoEstimadaFormatado)
            }
        ];
    }

    /**
     * Atribui o rótulo para o valor de Variação
     */
    private getLabelValorVariacao(label: string, valorVariacao: number): string {
        return label + ' - ' + valorVariacao + '%';
    }

    /**
     * Obtem o esforço de fase
     */
    totalEsforcoFases() {
        const initialValue = 0;
        return this.analise.esforcoFases.reduce((val, ef) => val + ef.esforcoFormatado, initialValue);
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
        this.confirmationService.confirm({
            message: MessageUtil.CONFIRMAR_BLOQUEIO.concat(this.analise.identificadorAnalise).concat('?'),
            accept: () => {
                const copy = this.analise.toJSONState();
                    this.analiseService.block(copy).subscribe(() => {
                    this.pageNotificationService.addBlockMsgWithName(this.analise.identificadorAnalise);
                    this.router.navigate(['analise/:id/view']);
                }, (error: Response) => {
                    switch (error.status) {
                        case 400: {
                            if (error.headers.toJSON()['x-abacoapp-error'][0] === "error.notadmin") {
                            this.pageNotificationService.addErrorMsg('Somente administradores podem bloquear/desbloquear análises!');
                            }
                        }
                    }
                    });
            }
        });
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
        this.setManual(contrato);
        this.diasGarantia = this.analise.contrato.diasDeGarantia;
        this.analise.esforcoFases = _.cloneDeep(contrato.manual.esforcoFases);
        this.analise.baselineImediatamente = true;
        this.analise.enviarBaseline = true;
    }

    /**
     * Método responsável por persistir as informações das análises na edição.
     **/
    save() {
        if(this.aguardarGarantia === undefined){
            this.analise.baselineImediatamente = true;
        }
        if(this.enviarParaBaseLine === undefined){
            this.analise.enviarBaseline = true;
        }
        this.validaCamposObrigatorios();
        if (this.verificarCamposObrigatorios()) {
            this.analiseService.update(this.analise).subscribe(() => {
                this.pageNotificationService.addSuccessMsg('Dados salvos com sucesso!');
                this.diasGarantia = this.analise.contrato.diasDeGarantia;
            });
        }
    }

    update() {
        this.validaCamposObrigatorios();
        if (this.verificarCamposObrigatorios()) {
            this.analiseService.update(this.analise);
            this.diasGarantia = this.analise.contrato.diasDeGarantia;
        }
    }

    private validaCamposObrigatorios() {
        const validacaoIdentificadorAnalise = this.analise.identificadorAnalise !== undefined;
        const validacaoContrato = this.analise.contrato !== undefined;
        const validacaoMetodoContagem = this.analise.metodoContagem !== null;
        const validacaoTipoAnallise = this.analise.tipoAnalise !== null;

        this.validacaoCampos = !(validacaoIdentificadorAnalise === true
            && validacaoContrato === true
            && validacaoMetodoContagem  === true
            && validacaoTipoAnallise === true );

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
        const isValid = true;

        if (!this.analise.identificadorAnalise) {
            this.pageNotificationService.addInfoMsg(MessageUtil.INFORME_IDENTIFICADOR);
            return isValid;
        }
        if (!this.analise.contrato) {
            this.pageNotificationService.addInfoMsg(MessageUtil.SELECIONE_CONTRATO_CONTINUAR);
            return isValid;
        }
        if (!this.analise.metodoContagem) {
            this.pageNotificationService.addInfoMsg(MessageUtil.INFORME_METODO_CONTAGEM);
            return isValid;
        }
        if (!this.analise.tipoAnalise) {
            this.pageNotificationService.addInfoMsg(MessageUtil.INFORME_TIPO_CONTAGEM);
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

}

