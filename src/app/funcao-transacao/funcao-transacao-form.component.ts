import { BaselineService } from './../baseline/baseline.service';
import { FuncaoDadosService } from './../funcao-dados/funcao-dados.service';
import { BaselineAnalitico } from './../baseline/baseline-analitico.model';
import {Component, OnInit, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {AnaliseSharedDataService, PageNotificationService, ResponseWrapper} from '../shared';
import {Analise, AnaliseService} from '../analise';
import {FatorAjuste} from '../fator-ajuste';

import * as _ from 'lodash';
import {Funcionalidade} from '../funcionalidade/index';
import {SelectItem} from 'primeng/primeng';
import {  BlockUI, NgBlockUI } from 'ng-block-ui';
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
import {FuncaoTransacao, TipoFuncaoTransacao} from './funcao-transacao.model';
import {Der} from '../der/der.model';
import { Impacto } from '../analise-shared/impacto-enum';
import {DerTextParser, ParseResult} from '../analise-shared/der-text/der-text-parser';
import { loginRoute } from '../login';

@Component({
    selector: 'app-analise-funcao-transacao',
    templateUrl: './funcao-transacao-form.component.html'
})
export class FuncaoTransacaoFormComponent implements OnInit, OnDestroy {

    @BlockUI() blockUI: NgBlockUI;      // Usado para bloquear o sistema enquanto aguarda resolução das requisições do backend

    textHeader: string;
    @Input() isView: boolean;
    isEdit: boolean;
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
    dadosBaselineFT: BaselineAnalitico[] = [];
    dadosserviceBL: BaselineService[]= [];
    funcoesTransacaoList: FuncaoTransacao[] = [];

    impacto: SelectItem[] = [
        {label: 'Inclusão', value: 'INCLUSAO'},
        {label: 'Alteração', value: 'ALTERACAO'},
        {label: 'Exclusão', value: 'EXCLUSAO'},
        {label: 'Conversão', value: 'CONVERSAO'},
        {label: 'Outros', value: 'ITENS_NAO_MENSURAVEIS'}
    ];

    baselineResultados: any[] = [];

    classificacoes: SelectItem[] = [];

    @Output()
    valueChange: EventEmitter<string> = new EventEmitter<string>();
    parseResult: ParseResult;
    text: string;
    @Input()
    label: string;
    showMultiplos = false;

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
        private analiseService: AnaliseService,
        private baselineService: BaselineService
    ) {
    }

    ngOnInit() {
        this.estadoInicial();
        this.hideShowQuantidade = true;
        this.currentFuncaoTransacao = new FuncaoTransacao();
        this.subscribeToAnaliseCarregada();
        this.initClassificacoes();
    }

    estadoInicial() {
        this.analiseSharedDataService.funcaoAnaliseDescarregada();
        this.currentFuncaoTransacao = new FuncaoTransacao();
        this.dersChips = [];
        this.alrsChips = [];
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
            if (this.showMultiplos) {
                let retorno = true;
                for (const nome of this.parseResult.textos) {
                    this.currentFuncaoTransacao.name = nome;
                    if (!this.multiplos()) {
                        retorno = false;
                        break;
                    }
                }
                if (retorno) {
                    this.analise.funcaoTransacaos.concat(this.funcoesTransacaoList);
                    this.salvarAnalise();
                    this.subscribeToAnaliseCarregada();
                    this.fecharDialog();
                }
            } else {
                if (this.adicionar()) {
                    this.fecharDialog();
                }
            }
        }
        if (this.blockUI.isActive) {
            this.blockUI.stop();
        }
    }

    multiplos(): boolean {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
            return false;
        } else {
            this.desconverterChips();
            this.verificarModulo();
            const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.metodoContagem,
                                                                           this.currentFuncaoTransacao,
                                                                           this.analise.contrato.manual);
            this.funcoesTransacaoList.push(funcaoTransacaoCalculada);
            this.analise.addFuncaoTransacao(funcaoTransacaoCalculada);
            this.atualizaResumo();
            this.resetarEstadoPosSalvar();
            return true;
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

    public carregarDadosBaseline() {
        this.baselineService.baselineAnaliticoFT(this.analise.sistema.id).subscribe((res: ResponseWrapper) => {
            this.dadosBaselineFT = res.json;
            console.log(res);
        });
    }

    recuperarNomeSelecionado(baselineAnalitico: BaselineAnalitico) {

        this.funcaoDadosService.getFuncaoTransacaoBaseline(baselineAnalitico.idfuncaodados)
        .subscribe((res: FuncaoTransacao) => {
            res.name = this.currentFuncaoTransacao.name;

                if (res.fatorAjuste === null) {res.fatorAjuste = undefined; }
                res.id = undefined;
                res.ders.forEach(ders => {
                    ders.id = undefined;
                });
                res.alrs.forEach(alrs => {
                    alrs.id = undefined;
                });

            this.prepararParaEdicao(res);
        });

    }

    searchBaseline(event): void {
        console.log(event);
        this.baselineResultados = this.dadosBaselineFT.filter(c => c.name.startsWith(event.query));
        console.log(this.baselineResultados);
    }

    // Funcionalidade Selecionada
    functionalitySelected(funcionalidade: Funcionalidade) {
        if (!funcionalidade) {
        } else {
            this.moduloCache = funcionalidade;
        }
        this.currentFuncaoTransacao.funcionalidade = funcionalidade;
    }

    adicionar(): boolean {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
            return false;
        } else {
        this.desconverterChips();
        this.verificarModulo();
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.metodoContagem,
                                                                       this.currentFuncaoTransacao,
                                                                       this.analise.contrato.manual);

            this.validarNameFuncaoTransacaos(this.currentFuncaoTransacao.name).then( resolve => {
                if (resolve) {
                    this.pageNotificationService.addCreateMsgWithName(funcaoTransacaoCalculada.name);
                    this.analise.addFuncaoTransacao(funcaoTransacaoCalculada);
                    this.atualizaResumo();
                    this.resetarEstadoPosSalvar();
                    this.estadoInicial();
                } else {
                    this.pageNotificationService.addErrorMsg('Registro já cadastrado!');
                }
             });
        }
        return retorno;
    }


    validarNameFuncaoTransacaos(nome: string) {
        const that = this;
        return new Promise( resolve => {
            if (that.analise.funcaoTransacaos.length === 0) {
                return resolve(true);
            }
            that.analise.funcaoTransacaos.forEach( (data, index) => {
                if (data.name === nome) {
                    return resolve(false);
                }
                if (!that.analise.funcaoTransacaos[index + 1]) {
                    return resolve(true);
                }
            });
        });
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

            if (this.alrsChips.length === 0) {
                this.erroTR = true;
                retorno = false;
            } else {
                this.erroTR = false;
            }

            if (this.dersChips.length === 0) {
                this.erroTD = true;
                retorno = false;
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
        this.analiseService.atualizaAnalise(this.analise);
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
        this.dersChips = this.dersChips.concat(dersReferenciadosChips);
        // }
    }

    private editar() {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg('Favor preencher o campo obrigatório!');
            return;
        } else {
        this.desconverterChips();
        this.verificarModulo();
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(
            this.analise.metodoContagem, this.currentFuncaoTransacao, this.analise.contrato.manual);
            this.validarNameFuncaoTransacaos(this.currentFuncaoTransacao.name).then( resolve => {
                    this.analise.updateFuncaoTransacao(funcaoTransacaoCalculada);
                    this.atualizaResumo();
                    this.resetarEstadoPosSalvar();
                    this.salvarAnalise();
                    this.fecharDialog();
                    this.pageNotificationService
                        .addSuccessMsg(`Função de Transação '${funcaoTransacaoCalculada.name}' alterada com sucesso`);
                    this.atualizaResumo();
                    this.resetarEstadoPosSalvar();
             });
        }
    }

    fecharDialog() {
        this.text = undefined;
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
                this.currentFuncaoTransacao.impacto = Impacto.ALTERACAO;
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
        this.carregarDadosBaseline();
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

    textChanged() {
        this.valueChange.emit(this.text);
        this.parseResult = DerTextParser.parse(this.text);
    }

    buttonMultiplos() {
        this.showMultiplos = !this.showMultiplos;
    }

}




