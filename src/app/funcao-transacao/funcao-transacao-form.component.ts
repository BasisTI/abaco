import { MemoryDatatableComponent } from './../memory-datatable/memory-datatable.component';
import { TranslateService } from '@ngx-translate/core';
import { AnaliseSharedUtils } from './../analise-shared/analise-shared-utils';
import { BaselineService } from './../baseline/baseline.service';
import { FuncaoDadosService } from './../funcao-dados/funcao-dados.service';
import { BaselineAnalitico } from './../baseline/baseline-analitico.model';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { AnaliseSharedDataService, PageNotificationService, ResponseWrapper, EntityToJSON } from '../shared';
import { Analise, AnaliseService } from '../analise';
import { FatorAjuste } from '../fator-ajuste';

import * as _ from 'lodash';
import { Funcionalidade } from '../funcionalidade/index';
import { SelectItem } from 'primeng/primeng';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DatatableClickEvent } from '@basis/angular-components';
import { ConfirmationService } from 'primeng/primeng';
import { ResumoFuncoes } from '../analise-shared/resumo-funcoes';
import { Subscription } from 'rxjs/Subscription';

import { FatorAjusteLabelGenerator } from '../shared/fator-ajuste-label-generator';
import { DerChipItem } from '../analise-shared/der-chips/der-chip-item';
import { DerChipConverter } from '../analise-shared/der-chips/der-chip-converter';
import { AnaliseReferenciavel } from '../analise-shared/analise-referenciavel';
import { Manual } from '../manual';
import { Modulo } from '../modulo';
import { CalculadoraTransacao } from '../analise-shared';
import { FuncaoTransacao, TipoFuncaoTransacao, Editor } from './funcao-transacao.model';
import { Der } from '../der/der.model';
import { Impacto } from '../analise-shared/impacto-enum';
import { DerTextParser, ParseResult } from '../analise-shared/der-text/der-text-parser';
import { FuncaoTransacaoService } from './funcao-transacao.service';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Base64Upload from '../../ckeditor/Base64Upload';

@Component({
    selector: 'app-analise-funcao-transacao',
    templateUrl: './funcao-transacao-form.component.html'
})
export class FuncaoTransacaoFormComponent implements OnInit, OnDestroy {

    @BlockUI() blockUI: NgBlockUI;      // Usado para bloquear o sistema enquanto aguarda resolução das requisições do backend

    faS: FatorAjuste[];

    textHeader: string;
    @Input() isView: boolean;
    isEdit: boolean;
    isFilter: boolean;
    nomeInvalido;
    classInvalida;
    impactoInvalido: boolean;
    deflatorVazio: boolean;
    hideElementTDTR: boolean;
    hideShowQuantidade: boolean;
    showDialog = false;
    sugestoesAutoComplete: string[] = [];
    windowHeightDialog: any;
    windowWidthDialog: any;
    impactos: string[];

    display: boolean = false;
    moduloCache: Funcionalidade;
    dersChips: DerChipItem[];
    alrsChips: DerChipItem[];
    resumo: ResumoFuncoes;
    fatoresAjuste: SelectItem[] = [];
    dadosBaselineFT: BaselineAnalitico[] = [];
    dadosserviceBL: BaselineService[] = [];
    funcoesTransacaoList: FuncaoTransacao[] = [];
    FuncaoTransacaoEditar: FuncaoTransacao;

    translateSubscriptions: Subscription[] = [];

    defaultSort = [{field: 'funcionalidade.nome', order: 1}];

    impacto: SelectItem[] = [
        { label: 'Inclusão', value: 'INCLUSAO' },
        { label: 'Alteração', value: 'ALTERACAO' },
        { label: 'Exclusão', value: 'EXCLUSAO' },
        { label: 'Conversão', value: 'CONVERSAO' },
        { label: 'Outros', value: 'ITENS_NAO_MENSURAVEIS' }
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
    @Input() properties: Editor;
    @Input() uploadImagem: boolean = true;
    @Input() criacaoTabela: boolean = true;

    @ViewChildren(MemoryDatatableComponent) tables: QueryList<MemoryDatatableComponent>;

    public Editor = ClassicEditor;

    public isDisabled = false;

    private fatorAjusteNenhumSelectItem = { label: 'Nenhum', value: undefined };
    private analiseCarregadaSubscription: Subscription;
    private subscriptionSistemaSelecionado: Subscription;
    private nomeDasFuncoesDoSistema: string[] = [];
    public erroModulo: boolean;
    public erroTR: boolean;
    public erroTD: boolean;
    public erroUnitario: boolean;
    public erroDeflator: boolean;

    public config = {
        extraPlugins: [Base64Upload],
        language: 'pt-br',
        toolbar: [
            'heading', '|', 'bold', 'italic', 'hiperlink', 'underline', 'bulletedList', 'numberedList', 'alignment', 'blockQuote', '|',
            'imageUpload', 'insertTable', 'imageStyle:side', 'imageStyle:full', 'mediaEmbed', '|', 'undo', 'redo'
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Parágrafo', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3' }
            ]
        },
        alignment: {
            options: ['left', 'right', 'center', 'justify']
        },
        image: {
            toolbar: [
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        }
    }


    constructor(
        private analiseSharedDataService: AnaliseSharedDataService,
        private confirmationService: ConfirmationService,
        private pageNotificationService: PageNotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private funcaoDadosService: FuncaoDadosService,
        private analiseService: AnaliseService,
        private baselineService: BaselineService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private translate: TranslateService,
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translateSubscriptions.push(this.translate.get(label).subscribe((res: string) => {
            str = res;
        }));
        return str;
    }

    ngOnInit() {
        this.estadoInicial();
        this.hideShowQuantidade = true;
        this.currentFuncaoTransacao = new FuncaoTransacao();
        this.subscribeToAnaliseCarregada();
        this.initClassificacoes();
        this.impactos = AnaliseSharedUtils.impactos;

        if (!this.uploadImagem) {
            this.config.toolbar.splice(this.config.toolbar.indexOf('imageUpload'));
        }
        if (!this.criacaoTabela) {
            this.config.toolbar.splice(this.config.toolbar.indexOf('insertTable'));
        }
    }

    estadoInicial() {
        this.analiseSharedDataService.funcaoAnaliseDescarregada();
        this.currentFuncaoTransacao = new FuncaoTransacao();
        this.dersChips = [];
        this.alrsChips = [];
        this.traduzirImpactos();
        this.subscribeDisplay();
    }

    sortColumn(event: any) {
        this.funcoesTransacoes.sort((a, b) => {
            switch (event.field) {
                case 'fatorAjuste': return this.sortByComposityField(a, b, event.field, 'nome');
                case 'funcionalidade': return this.sortByComposityField(a, b, event.field, 'nome');
                case 'sustantation': return this.sortByBinary(a, b, event.field);
                case 'funcionaldiade.modulo.nome': return this.sortByComposityField2(a, b, 'funcionalidade', 'modulo', 'nome');
                default: return this.sortByField(a, b, event.field);
            }
        });
        if (event.order < 0) {
            this.funcoesTransacoes = this.funcoesTransacoes.reverse();
        }
    }

    sortByComposityField(a: FuncaoTransacao, b: FuncaoTransacao, field: string, composity: string) {
        if (a[field][composity] > b[field][composity]) {
            return 1;
        } else if (a[field][composity] < b[field][composity]) {
            return -1;
        }
        return 0;
    }

    sortByComposityField2(a: FuncaoTransacao, b: FuncaoTransacao, field: string, composity: string, composity2: string) {
        if (a[field][composity][composity2] > b[field][composity][composity2]) {
            return 1;
        } else if (a[field][composity][composity2] < b[field][composity][composity2]) {
            return -1;
        }
        return 0;
    }

    sortByBinary(a: FuncaoTransacao, b: FuncaoTransacao, field: string): number {
        if (a[field] === true &&  b[field] === false) {
            return 1;
        } else if (a[field] === false && b[field] === true) {
            return -1;
        }
        return 0;
    }

    sortByField(a: FuncaoTransacao, b: FuncaoTransacao, field: string): number {
        if (a[field] > b[field]) {
            return 1;
        } else if (a[field] < b[field]) {
            return -1;
        }
        return 0;
    }

    private subscribeDisplay() {
        this.funcaoTransacaoService.display$.subscribe(
            (data: boolean) => {
               this.display = data;
            });
    }

    public onRowDblclick(event) {
        if (event.target.nodeName === 'TD') {
            this.abrirEditar();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar();
        }
    }

    selectRow(event) {
        this.FuncaoTransacaoEditar = event.data.clone();
    }

    abrirEditar() {
        this.isEdit = true;
        this.prepararParaEdicao(this.FuncaoTransacaoEditar);
    }
    /*
    *   Metodo responsavel por traduzir os tipos de impacto em função de dados
    */
    traduzirImpactos() {
        this.translate.stream(['Cadastros.FuncaoDados.Impactos.Inclusao', 'Cadastros.FuncaoDados.Impactos.Alteracao',
            'Cadastros.FuncaoDados.Impactos.Exclusao', 'Cadastros.FuncaoDados.Impactos.Conversao',
            'Cadastros.FuncaoDados.Impactos.Outros']).subscribe((traducao) => {
                this.impacto = [
                    { label: traducao['Cadastros.FuncaoDados.Impactos.Inclusao'], value: 'INCLUSAO' },
                    { label: traducao['Cadastros.FuncaoDados.Impactos.Alteracao'], value: 'ALTERACAO' },
                    { label: traducao['Cadastros.FuncaoDados.Impactos.Exclusao'], value: 'EXCLUSAO' },
                    { label: traducao['Cadastros.FuncaoDados.Impactos.Conversao'], value: 'CONVERSAO' },
                    { label: traducao['Cadastros.FuncaoDados.Impactos.Outros'], value: 'ITENS_NAO_MENSURAVEIS' }
                ];

            });
    }
    public onChange({ editor }: ChangeEvent) {
        const data = editor.getData();
        return data;
    }

    public onReady(eventData) {}



    updateImpacto(impacto: string) {
        switch (impacto) {
            case 'INCLUSAO':
                return this.getLabel('Cadastros.FuncaoTransacao.Inclusao');
            case 'ALTERACAO':
                return this.getLabel('Cadastros.FuncaoTransacao.Alteracao');
            case 'EXCLUSAO':
                return this.getLabel('Cadastros.FuncaoTransacao.Exclusao');
            case 'CONVERSAO':
                return this.getLabel('Cadastros.FuncaoTransacao.Conversao');
            default: return this.getLabel('Global.Mensagens.Nenhum');
        }
    }

    private initClassificacoes() {
        const classificacoes = Object.keys(TipoFuncaoTransacao).map(k => TipoFuncaoTransacao[k as any]);
        // TODO pipe generico?
        if (classificacoes) {
            classificacoes.forEach(c => {
                this.classificacoes.push({ label: c, value: c });
            });
        }
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
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
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
        this.textHeader = this.isEdit ? this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgAlterarFuncaoDeTransacao') : this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgAdicionarFuncaoDeTransacao');
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
        this.createPropertiesFlters();
        return this.analise.funcaoTransacaos;
    }

    /**
     * Este método gera os campos dinâmicos necessários para realizar filtros
     */
    private createPropertiesFlters() {
        this.analise.funcaoTransacaos.forEach(ft => Object.defineProperties(ft, {
            'derFilter': {value: ft.derValue(), writable: true},
            'ftrFilter': {value: ft.ftrValue(), writable: true}
        }));
    }

    set funcoesTransacoes(funcoesTransacaoes: FuncaoTransacao[]) {
        this.analise.funcaoTransacaos = funcoesTransacaoes;
    }

    private get analise(): Analise {
        return this.analiseSharedDataService.analise;
    }

    private get manual() {
        if (this.analiseSharedDataService.analise.contrato &&
            this.analiseSharedDataService.analise.contrato.manualContrato) {
            return this.analiseSharedDataService.analise.contrato.manualContrato[0].manual;
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
            return this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgSelecioneUmDeflator');
        } else {
            return this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgSelecioneUmContratoNaAbaGeralParaCarregarOsDeflatores');
        }
    }

    public carregarDadosBaseline() {
        this.baselineService.baselineAnaliticoFT(this.analise.sistema.id).subscribe((res: ResponseWrapper) => {
            this.dadosBaselineFT = res.json;
        });

    }

    recuperarNomeSelecionado(baselineAnalitico: BaselineAnalitico) {

        this.funcaoDadosService.getFuncaoTransacaoBaseline(baselineAnalitico.idfuncaodados)
            .subscribe((res: FuncaoTransacao) => {
                if (res.fatorAjuste === null) { res.fatorAjuste = undefined; }
                res.id = undefined;
                if (res.ders) {
                    res.ders.forEach(ders => {
                        ders.id = undefined;
                    });
                }
                if (res.alrs) {
                    res.alrs.forEach(alrs => {
                        alrs.id = undefined;
                    });
                }
                this.prepararParaEdicao(res);
            });

    }

    searchBaseline(event): void {

        let mdCache = this.moduloCache;

        this.baselineResultados = this.dadosBaselineFT.filter(function (fd) {
            var teste: string = event.query;
            return fd.name.toLowerCase().includes(teste.toLowerCase()) && fd.idfuncionalidade == mdCache.id;
        });

    }

    // Funcionalidade Selecionada
    functionalitySelected(funcionalidade: Funcionalidade) {
        if (!funcionalidade) {
        } else {
            this.moduloCache = funcionalidade;
        }
        this.currentFuncaoTransacao.funcionalidade = funcionalidade;
        this.carregarDadosBaseline();
    }


    adicionar(): boolean {
        const retorno: boolean = this.verifyDataRequire();

        if (!retorno) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return false;
        } else {
            if (this.currentFuncaoTransacao.fatorAjuste !== undefined) {
                this.desconverterChips();
                this.verificarModulo();
                const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.metodoContagem,
                    this.currentFuncaoTransacao,
                    this.analise.contrato.manual);

                this.validarFuncaoTransacaos(this.currentFuncaoTransacao).then(resolve => {
                    if (resolve) {
                        this.pageNotificationService.addCreateMsgWithName(funcaoTransacaoCalculada.name);
                        this.analise.addFuncaoTransacao(funcaoTransacaoCalculada);
                        this.atualizaResumo();
                        this.resetarEstadoPosSalvar();
                        this.salvarAnalise();
                        this.estadoInicial();
                    } else {
                        this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgRegistroCadastrado'));
                    }
                });
            }
        }
        return retorno;
    }


    validarFuncaoTransacaos(ft: FuncaoTransacao) {
        const that = this;
        return new Promise(resolve => {
            if (that.analise.funcaoTransacaos) {
                if (that.analise.funcaoTransacaos.length === 0) {
                    return resolve(true);
                }
                that.analise.funcaoTransacaos.forEach((data, index) => {
                    if (data.comparar(ft)) {
                        return resolve(false);
                    }
                    if (!that.analise.funcaoTransacaos[index + 1]) {
                        return resolve(true);
                    }
                });
            }
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
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgSelecioneUmDeflator'));
        } else {
            this.erroDeflator = false;
        }

        if (this.currentFuncaoTransacao.fatorAjuste === undefined){
            this.deflatorVazio = true;
            retorno = false;
        }else{
            this.deflatorVazio = false;
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
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgSelecioneUmModuloEFuncionalidade'));
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
        this.dersChips = this.dersChips.concat(dersReferenciadosChips);
    }

    private editar() {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return;
        } else {
            this.desconverterChips();
            this.verificarModulo();
            const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(
            this.analise.metodoContagem, this.currentFuncaoTransacao, this.analise.contrato.manual);
            this.analise.updateFuncaoTransacao(funcaoTransacaoCalculada);
            this.atualizaResumo();
            this.resetarEstadoPosSalvar();
            this.salvarAnalise();
            this.fecharDialog();
            this.atualizaResumo();
            this.resetarEstadoPosSalvar();
            this.pageNotificationService
                .addSuccessMsg(`${this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgFuncaoDeTransacao')}
                '${funcaoTransacaoCalculada.name}' ${this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgAlteradaComSucesso')}`);
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

        if (this.dersChips && this.alrsChips) {
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
        const button = event.button;
        if (button!== 'filter' && !event.selection) {
            return;
        }

        let funcaoTransacaoSelecionada: FuncaoTransacao;
        if(button !== 'filter' ) {
            funcaoTransacaoSelecionada = event.selection.clone();
        }

        switch (button) {
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
                this.textHeader = this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgClonarFuncaoDeTransacao');
                break;
            case 'filter':
            this.display = true;
            break;
        }
    }

    private prepararParaEdicao(funcaoTransacaoSelecionada: FuncaoTransacao) {

        this.disableTRDER();
        this.configurarDialog();


        this.currentFuncaoTransacao = funcaoTransacaoSelecionada;

        this.carregarValoresNaPaginaParaEdicao(funcaoTransacaoSelecionada);
        this.pageNotificationService.addInfoMsg(`${this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgAlterandoFuncaoDeTransacao')} '${funcaoTransacaoSelecionada.name}'`);
    }

    private carregarDersAlrs() {
        this.funcaoTransacaoService.getFuncaoTransacaosCompleta(this.currentFuncaoTransacao.id)
            .subscribe(funcaoTransacao => {
                this.currentFuncaoTransacao = funcaoTransacao;
            });
    }

    // Prepara para clonar
    private prepareToClone(funcaoTransacaoSelecionada: FuncaoTransacao) {
        this.analiseSharedDataService.currentFuncaoTransacao = funcaoTransacaoSelecionada;
        this.currentFuncaoTransacao.name = this.currentFuncaoTransacao.name + ' - Cópia';
        this.carregarValoresNaPaginaParaEdicao(funcaoTransacaoSelecionada);
        this.pageNotificationService.addInfoMsg(`${this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgClonandoFuncaoDeTransacao')} '${funcaoTransacaoSelecionada.name}'`);
    }

    private carregarValoresNaPaginaParaEdicao(funcaoTransacaoSelecionada: FuncaoTransacao) {
        this.funcaoDadosService.mod.next(funcaoTransacaoSelecionada.funcionalidade);

        this.analiseSharedDataService.funcaoAnaliseCarregada();
        this.carregarDerEAlr(funcaoTransacaoSelecionada);
        this.carregarFatorDeAjusteNaEdicao(funcaoTransacaoSelecionada);
    }

    private carregarFatorDeAjusteNaEdicao(funcaoSelecionada: FuncaoTransacao) {
        this.inicializaFatoresAjuste(this.manual);
        if (funcaoSelecionada.fatorAjuste !== undefined) {
            funcaoSelecionada.fatorAjuste = _.find(this.fatoresAjuste, { value: { 'id': funcaoSelecionada.fatorAjuste.id } }).value;
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
            message: `${this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgTemCertezaQueDesejaExcluirFuncaoDeTransacao')} '${funcaoTransacaoSelecionada.name}'?`,
            accept: () => {
                this.analise.deleteFuncaoTransacao(funcaoTransacaoSelecionada);
                this.salvarAnalise();
                this.pageNotificationService.addDeleteMsgWithName(funcaoTransacaoSelecionada.name);
            }
        });
    }

    formataFatorAjuste(fatorAjuste: FatorAjuste): string {
        return fatorAjuste ? FatorAjusteLabelGenerator.generate(fatorAjuste) : this.getLabel('Global.Mensagens.Nenhum');
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.analiseCarregadaSubscription.unsubscribe();
        this.translateSubscriptions.forEach(susbscription => susbscription.unsubscribe());
    }

    openDialog(param: boolean) {
        this.isEdit = param;
        this.disableTRDER();
        this.configurarDialog();
        this.currentFuncaoTransacao.sustantation = null;
        if (this.currentFuncaoTransacao.fatorAjuste !== undefined) {
            if (this.currentFuncaoTransacao.fatorAjuste.tipoAjuste === 'UNITARIO' && this.faS[0]) {
                this.hideShowQuantidade = false;
            } else {
                this.hideShowQuantidade = true;
            }
        }
    }

    openDialogAdcFT(param: boolean){
        this.isFilter = param;
        this.configurarDialog();
    }

    configurarDialog() {
        this.getTextDialog();
        this.windowHeightDialog = window.innerHeight * 0.60;
        this.windowWidthDialog = window.innerWidth * 0.50;
        this.showDialog = true;
    }


    private inicializaFatoresAjuste(manual: Manual) {
        if (manual.fatoresAjuste) {
            if (this.analise.manual) {
                this.faS = _.cloneDeep(this.analise.manual.fatoresAjuste);
                this.faS.sort((n1, n2) => {
                    if (n1.fator < n2.fator)
                        return 1;
                    if (n1.fator > n2.fator)
                        return -1;
                    return 0;
                });
                this.fatoresAjuste =
                    this.faS.map(fa => {
                        const label = FatorAjusteLabelGenerator.generate(fa);
                        return { label: label, value: fa };
                    });

                this.fatoresAjuste.unshift(this.fatorAjusteNenhumSelectItem);
            }
        }
    }

    textChanged() {
        this.valueChange.emit(this.text);
        this.parseResult = DerTextParser.parse(this.text);
    }

    buttonMultiplos() {
        this.showMultiplos = !this.showMultiplos;
    }

    limparDados() {
        if (this.currentFuncaoTransacao.name == '') {
            this.estadoInicial();
        }
    }


}

