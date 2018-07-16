import {Component, OnInit, Input, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {AnaliseSharedDataService, PageNotificationService} from '../shared';
import {FuncaoTransacao, TipoFuncaoTransacao} from './funcao-transacao.model';
import {Analise, AnaliseService} from '../analise';
import {FatorAjuste} from '../fator-ajuste';

import * as _ from 'lodash';
import {Modulo} from '../modulo/index';
import {Funcionalidade} from '../funcionalidade/index';
import {CalculadoraTransacao} from '../analise-shared/calculadora-transacao';
import {SelectItem} from 'primeng/primeng';
import {DatatableClickEvent} from '@basis/angular-components';
import {ConfirmationService} from 'primeng/primeng';
import {ResumoFuncoes} from '../analise-shared/resumo-funcoes';
import {Subscription} from 'rxjs/Subscription';
import {DerChipItem} from '../analise-shared/der-chips/der-chip-item';
import {AnaliseReferenciavel} from '../analise-shared/analise-referenciavel';
import {DerChipConverter} from '../analise-shared/der-chips/der-chip-converter';
import {Der} from '../der/der.model';
import {Manual} from '../manual';
import {FatorAjusteLabelGenerator} from '../shared/fator-ajuste-label-generator';

@Component({
    selector: 'app-analise-funcao-transacao',
    templateUrl: './funcao-transacao-form.component.html'
})
export class FuncaoTransacaoFormComponent implements OnInit, OnDestroy {

    isEdit; nomeInvalido; moduloInvalido; submoduloInvalido; classInvalida; impactoInvalido: boolean;

    isEstimada: boolean;

    dersChips: DerChipItem[] = [];

    alrsChips: DerChipItem[] = [];

    resumo: ResumoFuncoes;

    fatoresAjuste: SelectItem[] = [];

    classificacoes: SelectItem[] = [];

    colunasAMostrar = [];

    colunasOptions: SelectItem[];

    impacto: SelectItem[] = [
        {label: 'Inclusão', value: 'INCLUSAO'},
        {label: 'Alteração', value: 'ALTERACAO'},
        {label: 'Exclusão', value: 'EXCLUSAO'},
        {label: 'Conversão', value: 'CONVERSAO'},
        {label: 'Item Não Mensurável', value: 'INM'}
    ];

    private fatorAjusteNenhumSelectItem = {label: 'Nenhum', value: undefined};

    showDialogNovo = false;

    private analiseCarregadaSubscription: Subscription;

    constructor(
        private analiseSharedDataService: AnaliseSharedDataService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private analiseService: AnaliseService,
    ) {}

    /**
     *
    **/
    ngOnInit() {
        this.isEdit = false;
        this.iniciarObjetos();
        this.subscribeToAnaliseCarregada();
        this.initClassificacoes();
    }

    /**
     *
    **/
    private iniciarObjetos() {
        this.currentFuncaoTransacao = new FuncaoTransacao();
        this.currentFuncaoTransacao.funcionalidade = new Funcionalidade();
    }

    /**
     *
    **/
    private subscribeToAnaliseCarregada() {
        this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
            this.atualizaResumo();
        });
    }

    /**
     *
    **/
    private atualizaResumo() {
        this.resumo = this.analise.resumoFuncaoTransacoes;
        this.changeDetectorRef.detectChanges();
    }

    /**
     *
    **/
    private initClassificacoes() {
        const classificacoes = Object.keys(TipoFuncaoTransacao).map(k => TipoFuncaoTransacao[k as any]);
        // TODO pipe generico?
        classificacoes.forEach(c => {
            this.classificacoes.push({label: c, value: c});
        });
    }

    /**
     *
    **/
    get header(): string {
        return !this.isEdit ? 'Adicionar Função de Transação' : 'Alterar Função de Transação';
    }

    /**
     *
    **/
    get currentFuncaoTransacao(): FuncaoTransacao {
        return this.analiseSharedDataService.currentFuncaoTransacao;
    }

    /**
     *
    **/
    set currentFuncaoTransacao(currentFuncaoTransacao: FuncaoTransacao) {
        this.analiseSharedDataService.currentFuncaoTransacao = currentFuncaoTransacao;
    }

    /**
     *
    **/
    get funcoesTransacoes(): FuncaoTransacao[] {
        if (!this.analise.funcaoTransacaos) {
            return [];
        }
        return this.analise.funcaoTransacaos;
    }

    /**
     *
    **/
    private get analise(): Analise {
        this.isEstimada = this.analiseSharedDataService.analise.metodoContagem === 'ESTIMADA';
        return this.analiseSharedDataService.analise;
    }

    /**
     *
    **/
    private set analise(analise: Analise) {
        this.analiseSharedDataService.analise = analise;
    }

    /**
     *
    **/
    private get manual() {
        if (this.analiseSharedDataService.analise.contrato) {
            return this.analiseSharedDataService.analise.contrato.manual;
        }
        return undefined;
    }

    /**
     *
    **/
    isContratoSelected(): boolean {
        // FIXME p-dropdown requer 2 clicks quando o [options] chama um método get()
        const isContratoSelected = this.analiseSharedDataService.isContratoSelected();
        if (isContratoSelected && this.fatoresAjuste.length === 0) {
            this.inicializaFatoresAjuste(this.manual);
        }
        return isContratoSelected;
    }

    /**
     *
    **/
    fatoresAjusteDropdownPlaceholder() {
        if (this.isContratoSelected()) {
            return 'Selecione um Deflator';
        } else {
            return `Selecione um Contrato na aba 'Geral' para carregar os Deflatores`;
        }
    }

    /**
     *
    **/
    moduloSelected(modulo: Modulo) {
    }

    /**
     *
    **/
    funcionalidadeSelected(funcionalidade: Funcionalidade) {
        this.currentFuncaoTransacao.funcionalidade = funcionalidade;
    }

    /**
     *
    **/
    isFuncionalidadeSelected(): boolean {
        return !_.isUndefined(this.currentFuncaoTransacao.funcionalidade);
    }

    /**
     *
    **/
    deveHabilitarBotaoAdicionar(): boolean {
        // TODO complementar com outras validacoes
        return this.isFuncionalidadeSelected() && !_.isUndefined(this.analise.metodoContagem);
    }

    /**
     *
    **/
    get labelBotaoAdicionar() {
        return !this.isEdit ? 'Adicionar' : 'Alterar';
    }
    impactoValido() {
        this.impactoInvalido = false;
    }

    classValida() {
        this.classInvalida = false;
    }   
    /**
     *
    **/
    adicionar() {
        if (this.currentFuncaoTransacao.impacto === undefined) {this.impactoInvalido = true}
        if (this.currentFuncaoTransacao.name === undefined) {this.nomeInvalido = true}
        if (this.currentFuncaoTransacao.tipo === undefined) {this.classInvalida = true}

        if (this.currentFuncaoTransacao.tipo === undefined
            || this.currentFuncaoTransacao.impacto === undefined
            || this.currentFuncaoTransacao.name === undefined
            || this.currentFuncaoTransacao.funcionalidade.id === undefined) {
            this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
            return;
        }
        this.adicionarOuSalvar();
        this.salvarAnalise();
    }

    salvarAnalise() {
        this.analiseService.update(this.analise);
    }

    /**
     *
    **/
    private adicionarOuSalvar() {
        this.desconverterChips();
        this.doAdicionarOuSalvar();
        this.isEdit = false;
    }

    /**
     *
    **/
    private desconverterChips() {
        this.currentFuncaoTransacao.ders = DerChipConverter.desconverterEmDers(this.dersChips);
        this.currentFuncaoTransacao.alrs = DerChipConverter.desconverterEmAlrs(this.alrsChips);
    }

    /**
     *
    **/
    private doAdicionarOuSalvar() {
        if (this.isEdit) {
            this.doEditar();
        } else {
            this.doAdicionar();
        }
    }

    /**
     *
    **/
    private doEditar() {
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(
            this.analise.metodoContagem, this.currentFuncaoTransacao, this.analise.contrato.manual
        );
        // TODO temporal coupling
        this.analise.updateFuncaoTransacao(funcaoTransacaoCalculada);
        this.atualizaResumo();
        this.pageNotificationService.addSuccessMsg(`Função de Transação '${funcaoTransacaoCalculada.name}' alterada com sucesso`);
        this.resetarEstadoPosSalvar();
    }

    /**
     *
    **/
    private resetarEstadoPosSalvar() {
        this.iniciarObjetos();

        // Mantendo o mesmo conteudo a pedido do Leandro
        // this.currentFuncaoTransacao = this.currentFuncaoTransacao.clone();

        // TODO inappropriate intimacy DEMAIS
        this.currentFuncaoTransacao.artificialId = undefined;
        this.currentFuncaoTransacao.id = undefined;

        // clonando mas forçando novos a serem persistidos
        this.dersChips.forEach(c => c.id = undefined);
        this.alrsChips.forEach(c => c.id = undefined);
        this.showDialogNovo = false;
    }

    /**
     *
    **/
    private doAdicionar() {
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(
            this.analise.metodoContagem, this.currentFuncaoTransacao, this.analise.contrato.manual);
        // TODO temporal coupling entre 1-add() e 2-atualizaResumo(). 2 tem que ser chamado depois
        this.analise.addFuncaoTransacao(funcaoTransacaoCalculada);
        this.atualizaResumo();
        this.pageNotificationService.addCreateMsgWithName(funcaoTransacaoCalculada.name);
        this.resetarEstadoPosSalvar();
    }

    /**
     *
    **/
    datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }

        const funcaoSelecionada: FuncaoTransacao = event.selection.clone();
        switch (event.button) {
            case 'edit':
                this.isEdit = true;
                this.showDialogNovo = true;
                this.prepararParaEdicao(funcaoSelecionada);
                break;
            case 'delete':
                this.confirmDelete(funcaoSelecionada);
        }
    }

    /**
     *
    **/
    private prepararParaEdicao(funcaoSelecionada: FuncaoTransacao) {
        this.analiseSharedDataService.currentFuncaoTransacao = funcaoSelecionada;
        this.scrollParaInicioDaAba();
        this.carregarValoresNaPaginaParaEdicao(funcaoSelecionada);
        this.pageNotificationService.addInfoMsg(`Alterando Função de Transação '${funcaoSelecionada.name}'`);
    }

    /**
     *
    **/
    private scrollParaInicioDaAba() {
        window.scrollTo(0, 60);
    }

    /**
     *
    **/
    private carregarValoresNaPaginaParaEdicao(funcaoSelecionada: FuncaoTransacao) {
        this.analiseSharedDataService.funcaoAnaliseCarregada();

        if (funcaoSelecionada.fatorAjuste !== undefined && !funcaoSelecionada.fatorAjuste) {
            this.carregarFatorDeAjusteNaEdicao(funcaoSelecionada);
        }

        this.carregarDerEAlr(funcaoSelecionada);
    }

    /**
     * Método responsável por recuperar os fatores de ajustes quando se tratar de edição.
    **/
    private carregarFatorDeAjusteNaEdicao(funcaoSelecionada: FuncaoTransacao) {
        this.inicializaFatoresAjuste(this.manual);
        funcaoSelecionada.fatorAjuste = _.find(this.fatoresAjuste, {value: {'id': funcaoSelecionada.fatorAjuste.id}}).value;
    }

    /**
     * Método responsável por recuperar DER e ALR.
    **/
    private carregarDerEAlr(ft: FuncaoTransacao) {
        this.dersChips = this.carregarReferenciavel(ft.ders, ft.derValues);
        this.alrsChips = this.carregarReferenciavel(ft.alrs, ft.ftrValues);
    }

    /**
     * Método responsável por recuperar das referências AR.
    **/
    private carregarReferenciavel(referenciaveis: AnaliseReferenciavel[], strValues: string[]): DerChipItem[] {
        if (referenciaveis && referenciaveis.length > 0) { // situacao para analises novas e editadas
            return DerChipConverter.converterReferenciaveis(referenciaveis);
        } else { // SITUACAO para analises legadas
            return DerChipConverter.converter(strValues);
        }
    }

    /**
     *
    **/
    dersReferenciados(ders: Der[]) {
        // XXX manter os ids?
        const dersReferenciadosChips: DerChipItem[] = DerChipConverter.converterReferenciaveis(ders);
        this.dersChips = this.dersChips.concat(dersReferenciadosChips);
    }

    /**
     * Método responsável por cancelar e fechar a modal de alteração do formulário.
    **/
    cancelar() {
        this.limparDadosDaTelaNaEdicaoCancelada();
        this.showDialogNovo = false;
    }

    /**
     *
    **/
    cancelarEdicao() {
        this.showDialogNovo = false;
        this.analiseSharedDataService.funcaoAnaliseDescarregada();
        this.isEdit = false;
        this.limparDadosDaTelaNaEdicaoCancelada();
        this.pageNotificationService.addInfoMsg('Alteração cancelada.');
        this.scrollParaInicioDaAba();
    }

    /**
     *
    **/
    cancelarEdicaoDialog() {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja cancelar a alteração?`,
            accept: () => {
                this.analiseSharedDataService.funcaoAnaliseDescarregada();
                this.isEdit = false;
                this.showDialogNovo = false;
                this.pageNotificationService.addInfoMsg('Alteração cancelada.');
            }
        });
    }

    /**
     *
    **/
    private limparDadosDaTelaNaEdicaoCancelada() {
        this.iniciarObjetos();
        this.dersChips = [];
        this.alrsChips = [];
    }

    /**
     *
    **/
    confirmDelete(funcaoTransacaoSelecionada: FuncaoTransacao) {
        this.confirmationService.confirm({
            message: `Tem certeza que deseja excluir a Função de Transação '${funcaoTransacaoSelecionada.name}'?`,
            accept: () => {
                this.analise.deleteFuncaoTransacao(funcaoTransacaoSelecionada);
                this.salvarAnalise();
                this.atualizaResumo();
                this.pageNotificationService.addDeleteMsgWithName(funcaoTransacaoSelecionada.name);
            }
        });
    }

    delete(funcaoTransacaoSelecionada: FuncaoTransacao) {
        this.analise.deleteFuncaoTransacao(funcaoTransacaoSelecionada);
        this.pageNotificationService.addDeleteMsgWithName(funcaoTransacaoSelecionada.name);
    }

    /**
     *
    **/
    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.analiseCarregadaSubscription.unsubscribe();
    }

    /**
     * Método responsável por preparar o popup novo.
    **/
    openDialogNovo() {
        this.limparDadosDaTelaNaEdicaoCancelada();
        this.showDialogNovo = true;
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
