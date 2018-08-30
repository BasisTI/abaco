import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {AnaliseSharedDataService, PageNotificationService} from '../shared';
import {Analise, AnaliseService} from '../analise';
import {FatorAjuste} from '../fator-ajuste';

import * as _ from 'lodash';
import {Funcionalidade} from '../funcionalidade/index';
import {SelectItem} from 'primeng/primeng';
import {DatatableClickEvent} from '@basis/angular-components';
import {ConfirmationService} from 'primeng/primeng';
import {ResumoFuncoes} from '../analise-shared/resumo-funcoes';
import {Subscription} from 'rxjs/Subscription';

import {FatorAjusteLabelGenerator} from '../shared/fator-ajuste-label-generator';
import {DerChipItem} from '../analise-shared/der-chips/der-chip-item';
import {DerChipConverter} from '../analise-shared/der-chips/der-chip-converter';
import {AnaliseReferenciavel} from '../analise-shared/analise-referenciavel';
import {Manual} from '../manual';
import {Modulo} from '../modulo';
import {CalculadoraTransacao} from '../analise-shared';
import {FuncaoDadosService} from '../funcao-dados/funcao-dados.service';
import {FuncaoTransacao, TipoFuncaoTransacao} from './funcao-transacao.model';
import {Der} from '../der/der.model';

@Component({
    selector: 'app-analise-funcao-transacao',
    templateUrl: './funcao-transacao-form.component.html'
})
export class FuncaoTransacaoFormComponent implements OnInit, OnDestroy {

    textHeader: string;
    isEdit;
    nomeInvalido;
    classInvalida;
    impactoInvalido: boolean;
    hideElementTDTR: boolean;
    hideShowQuantidade: boolean;
    showDialog = false;
    sugestoesAutoComplete: string[] = [];
    windowHeightDialog: any;
    windowWidthDialog: any;

    moduloCache: Funcionalidade;
    dersChips: DerChipItem[];
    alrsChips: DerChipItem[];
    resumo: ResumoFuncoes;
    fatoresAjuste: SelectItem[] = [];

    impacto: SelectItem[] = [
        {label: 'Inclusão', value: 'INCLUSAO'},
        {label: 'Alteração', value: 'ALTERACAO'},
        {label: 'Exclusão', value: 'EXCLUSAO'},
        {label: 'Conversão', value: 'CONVERSAO'},
        {label: 'Outros', value: 'ITENS_NAO_MENSURAVEIS'}
    ];

    classificacoes: SelectItem[] = [];

    private fatorAjusteNenhumSelectItem = {label: 'Nenhum', value: undefined};
    private analiseCarregadaSubscription: Subscription;
    private subscriptionSistemaSelecionado: Subscription;
    private nomeDasFuncoesDoSistema: string[] = [];
    public erroTR: boolean;
    public erroTD: boolean;
    public erroUnitario: boolean;
    public erroDeflator: boolean;

    constructor(
        private analiseSharedDataService: AnaliseSharedDataService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private funcaoDadosService: FuncaoDadosService,
        private analiseService: AnaliseService
    ) {
    }

    ngOnInit() {
        this.hideShowQuantidade = true;
        this.currentFuncaoTransacao = new FuncaoTransacao();
        this.subscribeToAnaliseCarregada();
        this.initClassificacoes();
        //  this.subscribeToSistemaSelecionado();

    }

    private initClassificacoes() {
        const classificacoes = Object.keys(TipoFuncaoTransacao).map(k => TipoFuncaoTransacao[k as any]);
        // TODO pipe generico?
        classificacoes.forEach(c => {
            this.classificacoes.push({label: c, value: c});
        });
    }

    public buttonSaveEdit() {
        if (this.isEdit) {
            this.editar();
        } else {
            this.adicionar();
        }
    }

    disableTRDER() {
        this.hideElementTDTR = this.analiseSharedDataService.analise.metodoContagem === 'INDICATIVA'
            || this.analiseSharedDataService.analise.metodoContagem === 'ESTIMADA';
    }

    private subscribeToAnaliseCarregada() {
        this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
            this.atualizaResumo();
            //  this.loadDataFunctionsName();
        });
    }

    private atualizaResumo() {
        this.resumo = this.analise.resumoFuncaoTransacoes;
        this.changeDetectorRef.detectChanges();
    }

    getTextDialog() {
        this.textHeader = this.isEdit ? 'Alterar Função de Transação' : 'Adicionar Função de Transação';
    }

    get currentFuncaoTransacao(): FuncaoTransacao {
        return this.analiseSharedDataService.currentFuncaoTransacao;
    }

    set currentFuncaoTransacao(currentFuncaoTransacao: FuncaoTransacao) {
        this.analiseSharedDataService.currentFuncaoTransacao = currentFuncaoTransacao;
    }

    get funcoesTransacoes(): FuncaoTransacao[] {
        if (!this.analise.funcaoTransacaos) {
            return [];
        }
        return this.analise.funcaoTransacaos;
    }

    private get analise(): Analise {
        return this.analiseSharedDataService.analise;
    }

    private get manual() {
        if (this.analiseSharedDataService.analise.contrato) {
            return this.analiseSharedDataService.analise.contrato.manual;
        }
        return undefined;
    }

    isContratoSelected(): boolean {
        const isContratoSelected = this.analiseSharedDataService.isContratoSelected();
        if (isContratoSelected) {
            if (this.fatoresAjuste.length === 0) {
                this.inicializaFatoresAjuste(this.manual);
            }
        }
        return isContratoSelected;
    }

    contratoSelecionado() {
        if (this.currentFuncaoTransacao.fatorAjuste.tipoAjuste === 'UNITARIO') {
            this.hideShowQuantidade = this.currentFuncaoTransacao.fatorAjuste === undefined;
        } else {
            this.currentFuncaoTransacao.quantidade = undefined;
            this.hideShowQuantidade = true;
            this.currentFuncaoTransacao.quantidade = undefined;
        }
    }

    fatoresAjusteDropdownPlaceholder() {
        if (this.isContratoSelected()) {
            return 'Selecione um Deflator';
        } else {
            return `Selecione um Contrato na aba 'Geral' para carregar os Deflatores`;
        }
    }

    // Funcionalidade Selecionada
    functionalitySelected(funcionalidade: Funcionalidade) {
        if (!funcionalidade) {
        } else {
            this.moduloCache = funcionalidade;
        }
        this.currentFuncaoTransacao.funcionalidade = funcionalidade;
    }

    adicionar() {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
            return;
        }
        this.desconverterChips();
        this.verificarModulo();
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(
            this.analise.metodoContagem, this.currentFuncaoTransacao, this.analise.contrato.manual);

        this.analise.addFuncaoTransacao(funcaoTransacaoCalculada);
        this.atualizaResumo();
        this.resetarEstadoPosSalvar();

        this.salvarAnalise();
        this.fecharDialog();
        this.pageNotificationService.addCreateMsgWithName(funcaoTransacaoCalculada.name);
    }

    private verifyDataRequire(): boolean {
        let retorno = true;

        if (this.currentFuncaoTransacao.name === undefined) {
            this.nomeInvalido = true;
            retorno = false;
        } else {
            this.nomeInvalido = false;
        }

        if (this.currentFuncaoTransacao.impacto === undefined) {
            this.impactoInvalido = true;
            retorno = false;
        } else {
            this.impactoInvalido = false;
        }

        if (this.currentFuncaoTransacao.impacto.indexOf('ITENS_NAO_MENSURAVEIS') === 0
            && this.currentFuncaoTransacao.fatorAjuste === undefined) {
            this.erroDeflator = true;
            retorno = false;
            this.pageNotificationService.addErrorMsg('Selecione um Deflator');
        } else {
            this.erroDeflator = false;
        }

        this.classInvalida = this.currentFuncaoTransacao.tipo === undefined;
        if (this.currentFuncaoTransacao.fatorAjuste !== undefined) {
            if (this.currentFuncaoTransacao.fatorAjuste.tipoAjuste === 'UNITARIO' &&
                this.currentFuncaoTransacao.quantidade === undefined) {
                this.erroUnitario = true;
                retorno = false;
            } else {
                this.erroUnitario = false;
            }
        }

        if (this.analiseSharedDataService.analise.metodoContagem === 'DETALHADA') {
            if (this.dersChips === undefined || this.alrsChips === null) {
                this.erroTR = true;
                retorno = false;
            } else {
                this.erroTR = false;
            }
            if (this.dersChips === undefined || this.alrsChips === null) {
                // if (this.manual) {
                this.erroTD = true;
                retorno = false;
                // }
            } else {
                this.erroTD = false;
            }
        }

        if (this.currentFuncaoTransacao.funcionalidade === undefined) {
            this.pageNotificationService.addErrorMsg('Selecione um Módulo e Submódulo');
            retorno = false;
        }

        return retorno;
    }

    salvarAnalise() {
        this.analiseService.update(this.analise);
    }

    private desconverterChips() {
        if (this.dersChips != null && this.alrsChips != null) {
            this.currentFuncaoTransacao.ders = DerChipConverter.desconverterEmDers(this.dersChips);
            this.currentFuncaoTransacao.alrs = DerChipConverter.desconverterEmAlrs(this.alrsChips);
        }
    }

    dersReferenciados(ders: Der[]) {
        const dersReferenciadosChips: DerChipItem[] = DerChipConverter.converterReferenciaveis(ders);
        // if(this.dersChips !== undefined){
        this.dersChips = dersReferenciadosChips;
        // }
    }

    private editar() {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
            return;
        }
        this.desconverterChips();
        this.verificarModulo();

        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(
            this.analise.metodoContagem, this.currentFuncaoTransacao, this.analise.contrato.manual
        );

        this.analise.updateFuncaoTransacao(funcaoTransacaoCalculada);
        this.atualizaResumo();
        this.resetarEstadoPosSalvar();

        this.salvarAnalise();
        this.fecharDialog();
        this.pageNotificationService.addSuccessMsg(`Função de Transação '${funcaoTransacaoCalculada.name}' alterada com sucesso`);

    }

    fecharDialog() {
        this.limparMensagensErros();
        this.showDialog = false;
        this.analiseSharedDataService.funcaoAnaliseDescarregada();
        this.currentFuncaoTransacao = new FuncaoTransacao();
        this.dersChips = [];
        this.alrsChips = [];
        window.scrollTo(0, 60);
    }

    limparMensagensErros() {
        this.nomeInvalido = false;
        this.classInvalida = false;
        this.impactoInvalido = false;
        this.erroUnitario = false;
        this.erroTR = false;
        this.erroTD = false;
        this.erroDeflator = false;
    }

    private resetarEstadoPosSalvar() {
        this.currentFuncaoTransacao = this.currentFuncaoTransacao.clone();

        this.currentFuncaoTransacao.artificialId = undefined;
        this.currentFuncaoTransacao.id = undefined;

        if (this.dersChips != null && this.alrsChips != null) {
            this.dersChips.forEach(c => c.id = undefined);
            this.alrsChips.forEach(c => c.id = undefined);
        }

    }

    public verificarModulo() {
        if (this.currentFuncaoTransacao.funcionalidade !== undefined) {
            return;
        }
        this.currentFuncaoTransacao.funcionalidade = this.moduloCache;
    }

    classValida() {
        this.classInvalida = false;
    }

    impactoValido() {
        this.impactoInvalido = false;
    }

    datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }

        const funcaoTransacaoSelecionada: FuncaoTransacao = event.selection.clone();
        switch (event.button) {
            case 'edit':
                this.isEdit = true;
                this.prepararParaEdicao(funcaoTransacaoSelecionada);
                break;
            case 'delete':
                this.confirmDelete(funcaoTransacaoSelecionada);
                break;
            case 'clone':
                this.disableTRDER();
                this.configurarDialog();
                this.isEdit = false;
                this.prepareToClone(funcaoTransacaoSelecionada);
                this.currentFuncaoTransacao.id = undefined;
                this.currentFuncaoTransacao.artificialId = undefined;
        }
    }

    private prepararParaEdicao(funcaoTransacaoSelecionada: FuncaoTransacao) {

        this.disableTRDER();
        this.configurarDialog();

        this.analiseSharedDataService.currentFuncaoTransacao = funcaoTransacaoSelecionada;
        this.carregarValoresNaPaginaParaEdicao(funcaoTransacaoSelecionada);
        this.pageNotificationService.addInfoMsg(`Alterando Função de Transação '${funcaoTransacaoSelecionada.name}'`);
    }

    // Prepara para clonar
    private prepareToClone(funcaoTransacaoSelecionada: FuncaoTransacao) {
        this.analiseSharedDataService.currentFuncaoTransacao = funcaoTransacaoSelecionada;
        this.currentFuncaoTransacao.name = this.currentFuncaoTransacao.name + ' - Cópia';
        this.carregarValoresNaPaginaParaEdicao(funcaoTransacaoSelecionada);
        this.pageNotificationService.addInfoMsg(`Clonando Função de Transação '${funcaoTransacaoSelecionada.name}'`);
    }

    private carregarValoresNaPaginaParaEdicao(funcaoTransacaoSelecionada: FuncaoTransacao) {
        this.analiseSharedDataService.funcaoAnaliseCarregada();
        this.carregarDerEAlr(funcaoTransacaoSelecionada);
        this.carregarFatorDeAjusteNaEdicao(funcaoTransacaoSelecionada);
    }

    private carregarFatorDeAjusteNaEdicao(funcaoSelecionada: FuncaoTransacao) {
        this.inicializaFatoresAjuste(this.manual);
        if (funcaoSelecionada.fatorAjuste !== undefined) {
            funcaoSelecionada.fatorAjuste = _.find(this.fatoresAjuste, {value: {'id': funcaoSelecionada.fatorAjuste.id}}).value;
        }

    }

    private carregarDerEAlr(ft: FuncaoTransacao) {
        this.dersChips = this.loadReference(ft.ders, ft.derValues);
        this.alrsChips = this.loadReference(ft.alrs, ft.ftrValues);
    }

    moduloSelected(modulo: Modulo) {
    }

    // Carregar Referencial
    private loadReference(referenciaveis: AnaliseReferenciavel[],
                          strValues: string[]): DerChipItem[] {

        if (referenciaveis) {
            if (referenciaveis.length > 0) {
                return DerChipConverter.converterReferenciaveis(referenciaveis);
            } else {
                return DerChipConverter.converter(strValues);
            }
        } else {
            return DerChipConverter.converter(strValues);
        }
    }

    cancelar() {
        this.showDialog = false;
        this.fecharDialog();
    }


    confirmDelete(funcaoTransacaoSelecionada: FuncaoTransacao) {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja excluir a Função de Transação '${funcaoTransacaoSelecionada.name}'?`,
            accept: () => {
                this.analise.deleteFuncaoTransacao(funcaoTransacaoSelecionada);
                this.salvarAnalise();
                this.pageNotificationService.addDeleteMsgWithName(funcaoTransacaoSelecionada.name);
            }
        });
    }

    formataFatorAjuste(fatorAjuste: FatorAjuste): string {
        return fatorAjuste ? FatorAjusteLabelGenerator.generate(fatorAjuste) : 'Nenhum';
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.analiseCarregadaSubscription.unsubscribe();
    }

    openDialog(param: boolean) {
        this.isEdit = param;
        this.hideShowQuantidade = true;
        this.disableTRDER();
        this.configurarDialog();
    }

    configurarDialog() {
        this.getTextDialog();
        this.windowHeightDialog = window.innerHeight * 0.60;
        this.windowWidthDialog = window.innerWidth * 0.50;
        this.showDialog = true;
    }


    private inicializaFatoresAjuste(manual: Manual) {
        const faS: FatorAjuste[] = _.cloneDeep(manual.fatoresAjuste);
        this.fatoresAjuste =
            faS.map(fa => {
                const label = FatorAjusteLabelGenerator.generate(fa);
                return {label: label, value: fa};
            });
        this.fatoresAjuste.unshift(this.fatorAjusteNenhumSelectItem);
    }

}




