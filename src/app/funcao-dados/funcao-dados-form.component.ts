import {MetodoContagem} from './../analise/analise.model';
import {MemoryDatatableComponent} from './../memory-datatable/memory-datatable.component';
import {Der} from './../der/der.model';
import {TranslateService} from '@ngx-translate/core';
import {FuncaoDados} from './funcao-dados.model';
import {FatorAjuste} from '../fator-ajuste';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChildren
} from '@angular/core';
import {BaselineAnalitico} from './../baseline/baseline-analitico.model';
import {BaselineService} from './../baseline/baseline.service';
import {AnaliseSharedDataService, PageNotificationService, ResponseWrapper} from '../shared';
import {Analise, AnaliseService} from '../analise';

import * as _ from 'lodash';
import {Funcionalidade} from '../funcionalidade/index';
import {Column, ConfirmationService, SelectItem} from 'primeng/primeng';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Calculadora} from '../analise-shared/calculadora';
import {DatatableClickEvent} from '@basis/angular-components';
import {ResumoFuncoes} from '../analise-shared/resumo-funcoes';
import {Subscription} from 'rxjs/Subscription';

import {FatorAjusteLabelGenerator} from '../shared/fator-ajuste-label-generator';
import {DerChipItem} from '../analise-shared/der-chips/der-chip-item';
import {DerChipConverter} from '../analise-shared/der-chips/der-chip-converter';
import {AnaliseReferenciavel} from '../analise-shared/analise-referenciavel';
import {FuncaoDadosService} from './funcao-dados.service';
import {AnaliseSharedUtils} from '../analise-shared/analise-shared-utils';
import {Manual} from '../manual';
import {Modulo} from '../modulo';
import {DerTextParser, ParseResult} from '../analise-shared/der-text/der-text-parser';
import {Impacto} from '../analise-shared/impacto-enum';

import {Editor, FuncaoTransacao, TipoFuncaoTransacao} from './../funcao-transacao/funcao-transacao.model';
import {CalculadoraTransacao} from './../analise-shared/calculadora-transacao';
import {Alr} from '../alr/alr.model';
import {ChangeEvent} from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Base64Upload from '../../ckeditor/Base64Upload';
import {ActivatedRoute, Router} from '@angular/router';
import {FuncaoTransacaoService} from '../funcao-transacao/funcao-transacao.service';
import {MessageUtil} from '../util/message.util';

@Component({
    selector: 'app-analise-funcao-dados',
    templateUrl: './funcao-dados-form.component.html'
})
export class FuncaoDadosFormComponent implements OnInit, OnDestroy, AfterViewInit {

    @Output()
    valueChange: EventEmitter<string> = new EventEmitter<string>();
    parseResult: ParseResult;
    text: string;
    @Input()
    label: string;
    @Input() properties: Editor;
    @Input() uploadImagem = true;
    @Input() criacaoTabela = true;

    @ViewChildren(MemoryDatatableComponent) tables: QueryList<MemoryDatatableComponent>;

    public Editor = ClassicEditor;

    public isDisabled = false;

    faS: FatorAjuste[] = [];

    textHeader: string;
    @Input() isView: boolean;
    @BlockUI() blockUI: NgBlockUI;
    isEdit: boolean;
    crudExist = false;
    nomeInvalido: boolean;
    isSaving: boolean;
    listaFD: string[];
    classInvalida: boolean;
    impactoInvalido: boolean;
    hideElementTDTR: boolean;
    hideShowQuantidade: boolean;
    showDialog = false;
    showMultiplos = false;
    sugestoesAutoComplete: string[] = [];
    impactos: string[];

    windowHeightDialog: any;
    windowWidthDialog: any;

    moduloCache: Funcionalidade;
    dersChips: DerChipItem[] = [];
    rlrsChips: DerChipItem[] = [];
    resumo: ResumoFuncoes;
    fatoresAjuste: SelectItem[] = [];
    colunasOptions: SelectItem[];
    colunasAMostrar = [];
    dadosBaselineFD: BaselineAnalitico[] = [];
    results: string[];
    baselineResults: any[] = [];
    funcoesDadosList: FuncaoDados[] = [];
    funcaoDadosEditar: FuncaoDados = new FuncaoDados();

    translateSubscriptions: Subscription[] = [];

    impacto: SelectItem[] = [
        {label: 'Inclusão', value: 'INCLUSAO'},
        {label: 'Alteração', value: 'ALTERACAO'},
        {label: 'Exclusão', value: 'EXCLUSAO'},
        {label: 'Conversão', value: 'CONVERSAO'},
        {label: 'Outros', value: 'ITENS_NAO_MENSURAVEIS'}
    ];

    classificacoes: SelectItem[] = [
        {label: 'ALI - Arquivo Lógico Interno', value: 'ALI'},
        {label: 'AIE - Arquivo de Interface Externa', value: 'AIE'}
    ];

    crud: string [] = ['Excluir', 'Editar', 'Inserir', 'Pesquisar', 'Consultar'];

    idAnalise: Number;
    private fatorAjusteNenhumSelectItem = {label: 'Nenhum', value: undefined};
    private analiseCarregadaSubscription: Subscription;
    private subscriptionSistemaSelecionado: Subscription;
    private nomeDasFuncoesDoSistema: string[] = [];
    public erroModulo: boolean;
    public erroTR: boolean;
    public erroTD: boolean;
    public erroUnitario: boolean;
    public erroDeflator: boolean;

    public funcoesDados: FuncaoDados[];

    public config = {
        extraPlugins: [Base64Upload],
        language: 'pt-br',
        toolbar: [
            'heading', '|', 'bold', 'italic', 'hiperlink', 'underline', 'bulletedList', 'numberedList', 'alignment', 'blockQuote', '|',
            'imageUpload', 'insertTable', 'imageStyle:side', 'imageStyle:full', 'mediaEmbed', '|', 'undo', 'redo'
        ],
        heading: {
            options: [
                {model: 'paragraph', title: 'Parágrafo', class: 'ck-heading_paragraph'},
                {model: 'heading1', view: 'h1', title: 'Título 1', class: 'ck-heading_heading1'},
                {model: 'heading2', view: 'h2', title: 'Título 2', class: 'ck-heading_heading2'},
                {model: 'heading3', view: 'h3', title: 'Título 3', class: 'ck-heading_heading3'}
            ]
        },
        alignment: {
            options: ['left', 'right', 'center', 'justify']
        },
        image: {
            toolbar: []
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        }
    };
    private analise: Analise;
    public seletedFuncaoDados: FuncaoDados = new FuncaoDados();

    constructor(
        private analiseSharedDataService: AnaliseSharedDataService,
        private confirmationService: ConfirmationService,
        private route: ActivatedRoute,
        private pageNotificationService: PageNotificationService,
        private changeDetectorRef: ChangeDetectorRef,
        private funcaoDadosService: FuncaoDadosService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private analiseService: AnaliseService,
        private baselineService: BaselineService,
        private translate: TranslateService,
        private router: Router,
    ) {
    }

    getLabel(label: string | string[]) {
        let str: any;
        this.translateSubscriptions.push(this.translate.get(label).subscribe((res: string) => {
            str = res;
        }));
        return str;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.idAnalise = params['id'];
            this.isView = params['view'] !== undefined;
            this.funcaoDadosService.getFuncaoDadosByIdAnalise(this.idAnalise).subscribe(value => {
                this.analiseService.find(this.idAnalise).subscribe(analise => {
                    this.analise = analise;
                    this.funcoesDados = value;
                    this.disableAba = this.analise.metodoContagem === MessageUtil.INDICATIVA;
                    this.estadoInicial();
                    this.impactos = AnaliseSharedUtils.impactos;
                    if (!this.uploadImagem) {
                        this.config.toolbar.splice(this.config.toolbar.indexOf('imageUpload'));
                    }
                    if (!this.criacaoTabela) {
                        this.config.toolbar.splice(this.config.toolbar.indexOf('insertTable'));
                    }
                });
            });
        });
    }

    estadoInicial() {
        this.isSaving = false;
        this.hideShowQuantidade = true;
        this.seletedFuncaoDados = new FuncaoDados();
        this.seletedFuncaoDados.quantidade = 0;
        this.subscribeToAnaliseCarregada();
        this.colunasAMostrar = [];
        if (this.colunasOptions) {
            this.colunasOptions.map(selectItem => this.colunasAMostrar.push(selectItem.value));
        }
        this.traduzirClassificacoes();
        this.traduzirImpactos();
    }

    public onRowDblclick(event) {
        if (event.target.nodeName === 'TD') {
            this.abrirEditar();
        } else if (event.target.parentNode.nodeName === 'TD') {
            this.abrirEditar();
        }
    }

    ngAfterViewInit() {
        this.setSotableFields();
    }

    setSotableFields() {
        if (this.colunasAMostrar) {
            return;
        }
        // este forEach rodará apenas 1 vez, devido ao @ViewChildren retornar um array
        this.tables.forEach(table => {
            table.cols.forEach(column => {
                const item = this.colunasAMostrar.find(element =>
                    (element.header === column.header)
                );
                column.sortField = this.getField(item.header);
                column.filterField = this.getField(item.header);
                this.exceptions(column, item.header);
                column.ngAfterContentInit();
            });
        });
    }

    sortColumn(event: any) {
        this.funcoesDados.sort((a, b) => {
            switch (event.field) {
                case 'fatorAjuste':
                    return this.sortByComposityField(a, b, event.field, 'nome');
                case 'funcionalidade':
                    return this.sortByComposityField(a, b, event.field, 'nome');
                case 'sustantation':
                    return this.sortByBinary(a, b, event.field);
                case 'funcionaldiade.modulo.nome':
                    return this.sortByComposityField2(a, b, 'funcionalidade', 'modulo', 'nome');
                default:
                    return this.sortByField(a, b, event.field);
            }
        });
    }

    getField(header: string): string {
        switch (header) {
            case 'Nome':
                return 'name';
            case 'Módulo':
                return 'funcionaldiade.modulo.nome';
            case 'Impacto':
                return 'impacto';
            case 'Deflator':
                return 'fatorAjuste';
            case 'Funcionalidade':
                return 'funcionalidade';
            case 'PF - Total':
                return 'pf';
            case 'PF - Ajustado':
                return 'grossPF';
            case 'Classificação':
                return 'tipo';
            case 'DER (TD)':
                return 'der';
            case 'RLR(TR)':
                return 'rlr';
            case 'Complexidade':
                return 'complexidade';
            case 'Possui Fundamentação':
                return 'sustantation';
        }
    }

    exceptions(column: Column, field: string) {
        if (field === 'der' || field === 'rlr' || field === 'sustantation') {
            column.filterField = undefined;
            column.filter = false;
        }
    }

    sortByComposityField(a: FuncaoDados, b: FuncaoDados, field: string, composity: string) {
        if (a[field][composity] > b[field][composity]) {
            return 1;
        } else if (a[field][composity] < b[field][composity]) {
            return -1;
        }
        return 0;
    }

    sortByComposityField2(a: FuncaoDados, b: FuncaoDados, field: string, composity: string, composity2: string) {
        if (a[field][composity][composity2] > b[field][composity][composity2]) {
            return 1;
        } else if (a[field][composity][composity2] < b[field][composity][composity2]) {
            return -1;
        }
        return 0;
    }

    sortByBinary(a: FuncaoDados, b: FuncaoDados, field: string): number {
        if (a[field] === true && b[field] === false) {
            return 1;
        } else if (a[field] === false && b[field] === true) {
            return -1;
        }
        return 0;
    }

    sortByField(a: FuncaoDados, b: FuncaoDados, field: string): number {
        if (a[field] > b[field]) {
            return 1;
        } else if (a[field] < b[field]) {
            return -1;
        }
        return 0;
    }

    selectRow(event) {
        this.funcaoDadosEditar.id = event.data.id;
    }

    abrirEditar() {
        this.isEdit = true;
        this.prepararParaEdicao(this.funcaoDadosEditar);
    }

    public onChange({editor}: ChangeEvent) {
        const data = editor.getData();
        return data;
    }

    /*
    *   Metodo responsavel por traduzir as classificacoes que ficam em função de dados
    */
    traduzirClassificacoes() {
        this.translate.stream(['Cadastros.FuncaoDados.Classificacoes.ALI', 'Cadastros.FuncaoDados.Classificacoes.AIE'])
            .subscribe((traducao) => {
                this.classificacoes = [
                    {label: traducao['Cadastros.FuncaoDados.Classificacoes.ALI'], value: 'ALI'},
                    {label: traducao['Cadastros.FuncaoDados.Classificacoes.AIE'], value: 'AIE'},
                ];

            });
    }

    /*
    *   Metodo responsavel por traduzir os tipos de impacto em função de dados
    */
    traduzirImpactos() {
        this.translate.stream(['Cadastros.FuncaoDados.Impactos.Inclusao', 'Cadastros.FuncaoDados.Impactos.Alteracao',
            'Cadastros.FuncaoDados.Impactos.Exclusao', 'Cadastros.FuncaoDados.Impactos.Conversao',
            'Cadastros.FuncaoDados.Impactos.Outros']).subscribe((traducao) => {
            this.impacto = [
                {label: traducao['Cadastros.FuncaoDados.Impactos.Inclusao'], value: 'INCLUSAO'},
                {label: traducao['Cadastros.FuncaoDados.Impactos.Alteracao'], value: 'ALTERACAO'},
                {label: traducao['Cadastros.FuncaoDados.Impactos.Exclusao'], value: 'EXCLUSAO'},
                {label: traducao['Cadastros.FuncaoDados.Impactos.Conversao'], value: 'CONVERSAO'},
                {label: traducao['Cadastros.FuncaoDados.Impactos.Outros'], value: 'ITENS_NAO_MENSURAVEIS'}
            ];
        });
    }

    updateNameImpacto(impacto: string) {
        switch (impacto) {
            case 'INCLUSAO':
                return this.getLabel('Cadastros.FuncaoDados.Inclusao');
            case 'ALTERACAO':
                return this.getLabel('Cadastros.FuncaoDados.Alteracao');
            case 'EXCLUSAO':
                return this.getLabel('Cadastros.FuncaoDados.Exclusao');
            case 'CONVERSAO':
                return this.getLabel('Cadastros.FuncaoDados.Conversao');

        }
    }

    public buttonSaveEdit() {
        if (this.isEdit) {
            this.editar();
        } else {
            if (this.showMultiplos) {
                let retorno = true;
                for (const nome of this.parseResult.textos) {
                    this.seletedFuncaoDados.name = nome;
                    if (!this.multiplos()) {
                        retorno = false;
                        break;
                    }
                }
                if (retorno) {
                    this.funcoesDados.concat(this.funcoesDadosList);
                    this.salvarAnalise();
                    this.subscribeToAnaliseCarregada();
                    this.fecharDialog();
                }
            } else {
                this.adicionar();
            }
        }
        if (this.blockUI.isActive) {
            this.blockUI.stop();
        }
    }

    disableTRDER() {
        this.hideElementTDTR = this.analise.metodoContagem === 'INDICATIVA'
            || this.analise.metodoContagem === 'ESTIMADA';
    }

    private subscribeToAnaliseCarregada() {
        this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
            this.atualizaResumo();
            //  this.loadDataFunctionsName();
        });
    }

    public carregarDadosBaseline() {
        this.baselineService.baselineAnaliticoFD(this.analise.sistema.id).subscribe((res: ResponseWrapper) => {
            this.dadosBaselineFD = res.json;
        });
    }

    private atualizaResumo() {
        this.resumo = this.analise.resumoFuncaoDados;
    }

    private subscribeToSistemaSelecionado() {
        this.subscriptionSistemaSelecionado = this.analiseSharedDataService.getSistemaSelecionadoSubject()
            .subscribe(() => {
                this.loadDataFunctionsName();
            });
    }

    searchBaseline(event: { query: string; }): void {
        if (this.seletedFuncaoDados && this.seletedFuncaoDados.funcionalidade && this.seletedFuncaoDados.funcionalidade.id) {
            this.funcaoDadosService.autoCompletePEAnalitico(
                event.query, this.seletedFuncaoDados.funcionalidade.id).subscribe(
                value => {
                    this.baselineResults = value;
                }
            );
        }
    }

    // Carrega nome das funçeõs de dados
    private loadDataFunctionsName() {
        const sistemaId: number = this.analise.sistema.id;
        this.funcaoDadosService.findAllNamesBySistemaId(sistemaId).subscribe(
            nomes => {
                this.nomeDasFuncoesDoSistema = nomes;
                this.sugestoesAutoComplete = nomes.slice();

            });
    }

    autoCompleteNomes(event: { query: string; }) {

        // TODO qual melhor método? inclues? startsWith ignore case?
        this.sugestoesAutoComplete = this.nomeDasFuncoesDoSistema

            .filter(nomeFuncao => nomeFuncao.startsWith(event.query));
    }

    getTextDialog() {
        this.textHeader = this.isEdit ? this.getLabel('Cadastros.FuncaoDados.Mensagens.msgAlterarFuncaoDados')
            : this.getLabel('Cadastros.FuncaoDados.Mensagens.msgAdicionarFuncaoDados');
    }

    private setFieldsFilter() {
        this.funcoesDados.forEach(fd => this.setFields(fd));
    }


    private setFields(fd: FuncaoDados) {
        return Object.defineProperties(fd, {
            'derFilter': {value: fd.derValue(), writable: true},
            'rlrFilter': {value: fd.rlrValue(), writable: true},
            'fatorAjusteFilter': {value: this.formataFatorAjuste(fd.fatorAjuste), writable: true},
            'impactoFilter': {value: this.updateNameImpacto(fd.impacto), writable: true}
        });
    }

    private get manual() {
        if (this.analise.manual) {
            if (
                this.analise.manual.fatoresAjuste &&
                this.analise.manual.fatoresAjuste.length === 0
            ) {
                this.funcaoDadosService.getManualDeAnalise(
                    this.analise.manual.id
                ).subscribe(manual => {
                    this.analise.manual = manual;
                });
            }
            return this.analise.manual;
        }
        return undefined;
    }

    isContratoSelected(): boolean {
        if (this.analise && this.analise.contrato) {
            if (this.fatoresAjuste.length === 0) {
                this.inicializaFatoresAjuste(this.analise.manual);
            }
            return true;
        } else {
            return false;
        }
    }


    fatoresAjusteDropdownPlaceholder() {
        if (this.isContratoSelected()) {
            return this.getLabel('Cadastros.FuncaoDados.Mensagens.msgSelecioneDeflator');
        } else {
            return this.getLabel('Cadastros.FuncaoDados.Mensagens.msgSelecioneContratoParaCarregarDeflatores');
        }
    }

    // Funcionalidade Selecionada
    functionalitySelected(funcionalidade: Funcionalidade) {
        if (funcionalidade) { // necessario?
            this.moduloCache = funcionalidade;
        }
        this.seletedFuncaoDados.funcionalidade = funcionalidade;
        this.carregarDadosBaseline();
    }

    multiplos(): boolean {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return false;
        } else {
            this.desconverterChips();
            this.verificarModulo();
            const funcaoDadosCalculada = Calculadora.calcular(
                this.analise.metodoContagem, this.seletedFuncaoDados, this.analise.contrato.manual);
            this.funcoesDadosList.push(funcaoDadosCalculada);
            this.analise.addFuncaoDados(funcaoDadosCalculada);
            this.atualizaResumo();
            this.resetarEstadoPosSalvar();
            return true;
        }
    }

    validarNameFuncaoTransacaos(ft: FuncaoTransacao) {
        const that = this;
        return new Promise(resolve => {
            if (!(that.analise.funcaoTransacaos) || that.analise.funcaoTransacaos.length === 0) {
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
        });
    }

    adicionar(): boolean {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return retorno;
        } else {
            this.desconverterChips();
            this.verificarModulo();
            const funcaoDadosCalculada = Calculadora.calcular(this.analise.metodoContagem,
                this.seletedFuncaoDados,
                this.analise.contrato.manual);
            this.funcaoDadosService.existsWithName(
                this.seletedFuncaoDados.name,
                this.analise.id,
                this.seletedFuncaoDados.funcionalidade.id,
                this.seletedFuncaoDados.funcionalidade.modulo.id).subscribe(value => {
                if (value === false) {
                    this.pageNotificationService.addCreateMsgWithName(funcaoDadosCalculada.name);
                    this.funcaoDadosService.create(funcaoDadosCalculada, this.analise.id).subscribe((funcaoDados) => {
                        funcaoDadosCalculada.id = funcaoDados.id;
                        this.setFields(funcaoDadosCalculada);
                        this.funcoesDados.push(funcaoDadosCalculada);
                        this.fecharDialog();
                        this.atualizaResumo();
                        this.estadoInicial();
                        this.resetarEstadoPosSalvar();
                        this.blockUI.stop();
                    });
                } else {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.RegistroCadastrado'));
                }
                return retorno;
            });
        }
    }

    private verifyDataRequire(): boolean {
        let retorno = true;

        if (!this.seletedFuncaoDados.name) {
            this.nomeInvalido = true;
            retorno = false;
        } else {
            this.nomeInvalido = false;
        }

        if (!this.seletedFuncaoDados.tipo) {
            this.classInvalida = true;
            retorno = false;
        } else {
            this.classInvalida = false;
        }

        if (this.seletedFuncaoDados.impacto) {
            if (this.seletedFuncaoDados.impacto.indexOf('ITENS_NAO_MENSURAVEIS') === 0 &&
                this.seletedFuncaoDados.fatorAjuste === undefined) {
                this.erroDeflator = false;
                retorno = false;
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.FuncaoDados.Mensagens.msgSelecioneDeflator'));
            }
        } else {
            this.erroDeflator = true;
        }

        if (this.seletedFuncaoDados.fatorAjuste) {
            if (this.seletedFuncaoDados.fatorAjuste.tipoAjuste === 'UNITARIO' &&
                this.seletedFuncaoDados.quantidade === undefined) {
                this.erroUnitario = true;
                retorno = false;
            } else {
                this.erroUnitario = false;
            }
        }

        if (this.analise.metodoContagem === 'DETALHADA') {

            if (!this.rlrsChips || this.rlrsChips.length < 1) {
                this.erroTR = true;
                retorno = false;
            } else {
                this.erroTR = false;
            }

            if (!this.dersChips || this.dersChips.length < 1) {
                this.erroTD = true;
                retorno = false;
            } else {
                this.erroTD = false;
            }
        }

        if (this.seletedFuncaoDados.funcionalidade === undefined) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.FuncaoDados.Mensagens.msgSelecioneModuloFuncionalidade'));
            this.erroModulo = true;
            retorno = false;
        } else {
            this.erroModulo = false;
        }

        return retorno;
    }

    salvarAnalise() {

    }

    private desconverterChips() {
        if (this.dersChips != null && this.rlrsChips != null) {
            this.seletedFuncaoDados.ders = DerChipConverter.desconverterEmDers(this.dersChips);
            this.seletedFuncaoDados.rlrs = DerChipConverter.desconverterEmRlrs(this.rlrsChips);
        }
    }

    private editar() {
        const retorno: boolean = this.verifyDataRequire();
        if (!retorno) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCampoObrigatorio'));
            return;
        } else {
            this.funcaoDadosService.existsWithName(
                this.seletedFuncaoDados.name,
                this.analise.id,
                this.seletedFuncaoDados.funcionalidade.id,
                this.seletedFuncaoDados.funcionalidade.modulo.id,
                this.seletedFuncaoDados.id)
                .subscribe(existFuncaoDado => {
                    this.desconverterChips();
                    this.verificarModulo();
                    const funcaoDadosCalculada = Calculadora.calcular(
                        this.analise.metodoContagem, this.seletedFuncaoDados, this.analise.contrato.manual);
                    this.funcaoDadosService.update(funcaoDadosCalculada).subscribe(value => {
                        this.funcoesDados = this.funcoesDados.filter((funcaoDados) => (funcaoDados.id !== funcaoDadosCalculada.id));
                        this.setFields(funcaoDadosCalculada);
                        this.funcoesDados.push(funcaoDadosCalculada);
                        this.resetarEstadoPosSalvar();
                        this.pageNotificationService.addSuccessMsg(`${this.getLabel('Cadastros.FuncaoDados.Mensagens.msgFuncaoDados')}
                '${funcaoDadosCalculada.name}' ${this.getLabel('Cadastros.FuncaoDados.Mensagens.msgAlteradaComSucesso')}`);
                        this.fecharDialog();
                    });
                });
        }
    }

    fecharDialog() {
        this.text = undefined;
        this.limparMensagensErros();
        this.showDialog = false;
        this.analiseSharedDataService.funcaoAnaliseDescarregada();
        this.seletedFuncaoDados = new FuncaoDados();
        this.dersChips = [];
        this.rlrsChips = [];
        window.scrollTo(0, 60);
    }

    limparMensagensErros() {
        this.nomeInvalido = false;
        this.classInvalida = false;
        this.impactoInvalido = false;
        this.erroModulo = false;
        this.erroUnitario = false;
        this.erroTR = false;
        this.erroTD = false;
        this.erroDeflator = false;
    }

    private resetarEstadoPosSalvar() {
        this.seletedFuncaoDados = this.seletedFuncaoDados.clone();

        this.seletedFuncaoDados.artificialId = undefined;
        this.seletedFuncaoDados.id = undefined;

        if (this.dersChips && this.rlrsChips) {
            this.dersChips.forEach(c => c.id = undefined);
            this.rlrsChips.forEach(c => c.id = undefined);
        }

    }

    public verificarModulo() {
        if (this.seletedFuncaoDados.funcionalidade !== undefined) {
            return;
        }
        this.seletedFuncaoDados.funcionalidade = this.moduloCache;
    }

    classValida() {
        this.classInvalida = false;
    }

    impactoValido() {
        this.impactoInvalido = false;
    }

    /**
     * Método responsável por recuperar o nome selecionado no combo.
     * @param nome
     */
    recuperarNomeSelecionado(funcaoDados: FuncaoDados) {
        this.funcaoDadosService.getFuncaoDadosBaseline(funcaoDados.id)
            .subscribe((res: FuncaoDados) => {
                this.seletedFuncaoDados = res;
                this.seletedFuncaoDados.id = null;
                this.carregarValoresNaPaginaParaEdicao(this.seletedFuncaoDados);
                this.disableTRDER();
                this.configurarDialog();
                this.blockUI.stop();
            });
    }

    datatableClick(event: DatatableClickEvent) {
        if (!event.selection) {
            return;
        }
        const funcaoDadosSelecionada: FuncaoDados = event.selection;
        switch (event.button) {
            case 'edit':
                this.isEdit = true;
                this.prepararParaEdicao(funcaoDadosSelecionada);
                break;
            case 'delete':
                this.confirmDelete(funcaoDadosSelecionada);
                break;
            case 'clone':
                this.disableTRDER();
                this.configurarDialog();
                this.isEdit = false;
                this.prepareToClone(funcaoDadosSelecionada);
                this.seletedFuncaoDados.id = undefined;
                this.seletedFuncaoDados.artificialId = undefined;
                this.seletedFuncaoDados.impacto = Impacto.ALTERACAO;
                this.textHeader = this.getLabel('Cadastros.FuncaoDados.Mensagens.msgClonarFuncaoDados');
                break;
            case 'crud':
                this.createCrud(funcaoDadosSelecionada);
        }
    }

    inserirCrud(funcaoTransacaoAtual: FuncaoTransacao) {
        this.funcaoTransacaoService.existsWithName(
            funcaoTransacaoAtual.name,
            this.analise.id,
            funcaoTransacaoAtual.funcionalidade.id,
            funcaoTransacaoAtual.funcionalidade.modulo.id)
            .subscribe(existFuncaoTranasacao => {
                if (!existFuncaoTranasacao) {
                    this.funcaoTransacaoService.create(funcaoTransacaoAtual, this.analise.id).subscribe(() => {
                        this.pageNotificationService.addCreateMsgWithName(funcaoTransacaoAtual.name);
                        this.resetarEstadoPosSalvar();
                        this.persistirFuncaoTransacao(funcaoTransacaoAtual);
                        this.estadoInicial();
                    });
                } else {
                    this.pageNotificationService.addErrorMsg('CRUD já cadastrado!');
                }
            });
    }

    private gerarAlr(funcaoTransacaoCalculada: FuncaoTransacao, fnDado: FuncaoDados) {
        const alr = new Alr(undefined, fnDado.name, undefined, null);
        if (funcaoTransacaoCalculada.alrs !== undefined && funcaoTransacaoCalculada.alrs != null) {
            funcaoTransacaoCalculada.alrs.push(alr);
        } else {
            const alrs: Alr[] = [];
            alrs.push(alr);
            funcaoTransacaoCalculada.alrs = alrs;
        }
    }

    private createCrud(funcaoDadosSelecionada) {
        this.funcaoDadosService.getById(funcaoDadosSelecionada.id).subscribe(funcaoDados => {
            this.crud.forEach(element => {
                this.inserirCrud(this.gerarFuncaoTransacao(element, funcaoDados));
            });
        });
    }

    private gerarFuncaoTransacao(tipo: string, fdSelecionada: FuncaoDados): FuncaoTransacao {
        const ft = new FuncaoTransacao();
        ft.name = tipo;
        ft.funcionalidade = fdSelecionada.funcionalidade;
        if (tipo === 'Pesquisar') {
            ft.tipo = TipoFuncaoTransacao.CE;
        } else if (tipo === 'Consultar') {
            ft.tipo = TipoFuncaoTransacao.CE;
        } else {
            ft.tipo = TipoFuncaoTransacao.EE;
        }
        ft.fatorAjuste = fdSelecionada.fatorAjuste;
        ft.ders = [];
        fdSelecionada.ders.forEach(item => ft.ders.push(item));
        if (this.analise.metodoContagem === MetodoContagem.DETALHADA) {
            this.criarDersMensagemAcao(ft.ders);
            this.gerarAlr(ft, fdSelecionada);
        }
        this.desconverterChips();
        this.verificarModulo();
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.metodoContagem,
            ft,
            this.analise.contrato.manual);
        return funcaoTransacaoCalculada;
    }

    private criarDersMensagemAcao(ders: Der[]) {
        ders.push(new Der(undefined, 'Mensagem'));
        ders.push(new Der(undefined, 'Ação'));
    }

    private persistirFuncaoTransacao(ft: FuncaoTransacao) {
        this.funcaoDadosService.gerarCrud(ft);
    }

    private prepararParaEdicao(funcaoDadosSelecionada: FuncaoDados) {
        this.funcaoDadosService.getById(funcaoDadosSelecionada.id).subscribe(funcaoDados => {
            this.seletedFuncaoDados = funcaoDados;
            this.carregarValoresNaPaginaParaEdicao(this.seletedFuncaoDados);
            this.disableTRDER();
            this.configurarDialog();
            this.pageNotificationService.addInfoMsg(
                `${this.getLabel('Cadastros.FuncaoDados.Mensagens.msgAlterandoFuncaoDados')} '${funcaoDadosSelecionada.name}'`
            );
            this.blockUI.stop();
        });
    }

    // Prepara para clonar
    private prepareToClone(funcaoDadosSelecionada: FuncaoDados) {
        this.funcaoDadosService.getById(funcaoDadosSelecionada.id).subscribe(funcaoDados => {
            this.seletedFuncaoDados = funcaoDados;
            this.seletedFuncaoDados.id = null;
            this.seletedFuncaoDados.name = this.seletedFuncaoDados.name + this.getLabel('Cadastros.FuncaoDados.Copia');
            this.carregarValoresNaPaginaParaEdicao(this.seletedFuncaoDados);
            this.disableTRDER();
            this.configurarDialog();
            this.pageNotificationService.addInfoMsg(
                `${this.getLabel('Cadastros.FuncaoDados.Mensagens.msgClonandoFuncaoDados')} '${funcaoDadosSelecionada.name}'`
            );
            this.blockUI.stop();
        });
    }

    private carregarValoresNaPaginaParaEdicao(funcaoDadosSelecionada: FuncaoDados) {
        /* Envia os dados para o componente modulo-funcionalidade-component.ts*/
        this.funcaoDadosService.mod.next(funcaoDadosSelecionada.funcionalidade);
        this.analiseSharedDataService.funcaoAnaliseCarregada();
        this.carregarDerERlr(funcaoDadosSelecionada);
        this.carregarFatorDeAjusteNaEdicao(funcaoDadosSelecionada);
    }

    private carregarFatorDeAjusteNaEdicao(funcaoSelecionada: FuncaoDados) {
        this.inicializaFatoresAjuste(this.analise.manual);
        if (funcaoSelecionada.fatorAjuste !== undefined) {
            funcaoSelecionada.fatorAjuste = _.find(this.fatoresAjuste, {value: {'id': funcaoSelecionada.fatorAjuste.id}}).value;
        }
    }

    private carregarDerERlr(fd: FuncaoDados) {
        if (fd.ders && fd.derValues) {
            const ders = this.loadReference(fd.ders, fd.derValues);
            this.dersChips = ders.filter(der => {
                return !(der.text === 'Mensagem' || der.text === 'Ação');
            });
            this.rlrsChips = this.loadReference(fd.rlrs, fd.rlrValues);
        }
    }

    moduloSelected(modulo: Modulo) {
    }

    disableAba: Boolean = false;

    // Carregar Referencial
    private loadReference(referenciaveis: AnaliseReferenciavel[],
                          strValues: string[]): DerChipItem[] {
        if (referenciaveis) {
            if (referenciaveis.length > 0) {
                if (this.isEdit) {
                    return DerChipConverter.converterReferenciaveis(referenciaveis);
                } else {
                    return DerChipConverter.convertertReferenciaveisToClone(referenciaveis);

                }
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


    confirmDelete(funcaoDadosSelecionada: FuncaoDados) {
        this.confirmationService.confirm({
            message: `${this.getLabel(
                'Cadastros.FuncaoDados.Mensagens.msgCertezaDesejaExcluirFuncaoDados')} '${funcaoDadosSelecionada.name}'?`,
            accept: () => {
                this.funcaoDadosService.delete(funcaoDadosSelecionada.id).subscribe(value => {
                    this.funcoesDados = this.funcoesDados.filter((funcaoDados) => (funcaoDados.id !== funcaoDadosSelecionada.id));
                    this.pageNotificationService.addDeleteMsgWithName(funcaoDadosSelecionada.name);
                });
            }
        });
    }

    formataFatorAjuste(fatorAjuste: FatorAjuste): string {
        return fatorAjuste ? FatorAjusteLabelGenerator.generate(fatorAjuste) : this.getLabel('Global.Mensagens.Nenhum');
    }

    ordenarColunas(colunasAMostrarModificada: SelectItem[]) {
        this.colunasAMostrar = colunasAMostrarModificada;
        this.colunasAMostrar = _.sortBy(this.colunasAMostrar, col => col.index);
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.analiseCarregadaSubscription.unsubscribe();
        this.translateSubscriptions.forEach(susbscription => susbscription.unsubscribe());
    }

    openDialog(param: boolean) {
        this.subscribeToAnaliseCarregada();
        this.isEdit = param;
        this.disableTRDER();
        this.configurarDialog();
        this.seletedFuncaoDados.fatorAjuste = this.faS[0];
        this.seletedFuncaoDados.sustantation = null;
        if (this.seletedFuncaoDados.fatorAjuste.tipoAjuste === 'UNITARIO' && this.faS[0]) {
            this.hideShowQuantidade = false;
        } else {
            this.hideShowQuantidade = true;
        }
    }

    configurarDialog() {
        this.getTextDialog();
        this.windowHeightDialog = window.innerHeight * 0.60;
        this.windowWidthDialog = window.innerWidth * 0.50;
        this.showDialog = true;
    }

    private inicializaFatoresAjuste(manual: Manual) {
        if (manual) {
            if (manual.fatoresAjuste) {
                this.faS = _.cloneDeep(manual.fatoresAjuste);
                this.faS.sort((n1, n2) => {
                    if (n1.fator < n2.fator) {
                        return 1;
                    }
                    if (n1.fator > n2.fator) {
                        return -1;
                    }
                    return 0;
                });
                this.fatoresAjuste =
                    this.faS.map(fa => {
                        const label = FatorAjusteLabelGenerator.generate(fa);
                        return {label: label, value: fa};
                    });
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

    handleChange(e) {
        const index = e.index;
        let link;
        switch (index) {
            case 0:
                if (this.isView) {
                    link = ['/analise/' + this.analise.id + '/view'];
                }else {
                    link = ['/analise/' + this.analise.id + '/edit'];
                }
                break;
            case 1:
                return;
            case 2:
                if (this.isView) {
                    link = ['/analise/' + this.analise.id + '/funcao-transacao/view'];
                }else {
                    link = ['/analise/' + this.analise.id + '/funcao-transacao'];
                }
                break;
            case 3:
                if (this.isView) {
                    link = ['/analise/' + this.analise.id + '/resumo/view'];
                }else {
                    link = ['/analise/' + this.analise.id + '/resumo'];
                }
                break;
        }
        this.router.navigate(link);
    }

}
