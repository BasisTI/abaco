import { Component, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageUtil } from '../util/message.util';
import { SelectItem, Dropdown } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Rx';
import { AnaliseService, Analise } from '../analise';
import { AnaliseSharedDataService, ResponseWrapper, ElasticQuery, PageNotificationService } from '../shared';
import { Manual } from '../manual';
import { Organizacao } from '../organizacao';
import { Contrato } from '../contrato';
import { Sistema, SistemaService } from '../sistema';
import { EsforcoFase } from '../esforco-fase';
import { TipoEquipeService } from '../tipo-equipe';
import { FatorAjuste } from '../fator-ajuste';
import { FatorAjusteLabelGenerator } from '../shared/fator-ajuste-label-generator';
import * as _ from 'lodash';
import { Modulo } from '../modulo';
import { FuncaoDadosService } from '../funcao-dados/funcao-dados.service';

import { Funcionalidade, FuncionalidadeService } from '../funcionalidade';
import { FuncaoTransacao } from '../funcao-transacao';
import { DatatableComponent } from '@basis/angular-components';
import { CalculadoraTransacao } from '../analise-shared';
import { StringConcatService } from '../shared/string-concat.service';
import { FuncaoTransacaoService } from '../funcao-transacao/funcao-transacao.service';

@Component({
    selector: 'app-pesquisar-ft',
    templateUrl: './pesquisar-ft.component.html',
})
export class PesquisarFtComponent implements OnInit, OnDestroy {

    @Input() display;
    private routeSub: Subscription;

    enviarParaBaseLine: boolean;

    disableFuncaoTrasacao: boolean;

    query: String = "*";

    isEdit: boolean;

    disableAba: boolean;

    currentFuncaoTransacao: FuncaoTransacao;

    private oldModuloSelectedId = -1;

    organizacoes: Organizacao[];

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

    searchUrl = "/api/_search/funcao-transacaos"

    modulos: Modulo[];

    public validacaoCampos: boolean;

    diasGarantia: number;

    contratos: Contrato[];

    sistemas: Sistema[];

    funcionalidades: Funcionalidade[];

    arrayFt: any[] = [];

    fn: Funcionalidade[] = [];

    analises: Analise[];

    funcaoTransacaoFuncionalidade: Funcionalidade[] = [];

    esforcoFases: EsforcoFase[] = [];

    metodosContagem: SelectItem[] = [];

    fatoresAjuste: SelectItem[] = [];

    equipeResponsavel: SelectItem[] = [];

    funcoesTransacaoList: FuncaoTransacao[] = [];

    mod = new Modulo();

    teste: any;

    manual: Manual;

    novoDeflator: FatorAjuste;

    moduloSelecionado: Modulo;

    funcionalidadeAtual: Funcionalidade;

    funcionalidadeSelecionada: Funcionalidade;

    @Output()
    moduloSelectedEvent = new EventEmitter<Modulo>();

    nomeManual = this.getLabel('Analise.SelecioneUmContrato');

    private fatorAjusteNenhumSelectItem = { label: this.getLabel('Global.Mensagens.DeflatorDeOrigen'), value: undefined };

    public hideShowSelectEquipe: boolean;

    elasticQuery: ElasticQuery = new ElasticQuery();

    searchParams: any = {
        modulo: undefined
    };

    constructor(
        private translate: TranslateService,
        private route: ActivatedRoute,
        private analiseService: AnaliseService,
        private analiseSharedDataService: AnaliseSharedDataService,
        private sistemaService: SistemaService,
        private equipeService: TipoEquipeService,
        private changeDetectorRef: ChangeDetectorRef,
        private funcaoDadosService: FuncaoDadosService,
        private funcionalidadeService: FuncionalidadeService,
        private pageNotificationService: PageNotificationService,
        private funcaoTransacaoService:  FuncaoTransacaoService


    ) { }

    ngOnInit() {
        this.getAnalise();
        this.estadoInicial();
        this.getTodasAnalisesBaseline();

    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    tiposAnalise: SelectItem[] = [
        { label: MessageUtil.PROJETO_DESENVOLVIMENTO, value: MessageUtil.DESENVOLVIMENTO },
        { label: MessageUtil.PROJETO_MELHORIA, value: MessageUtil.MELHORIA },
        { label: MessageUtil.CONTAGEM_APLICACAO, value: MessageUtil.APLICACAO }
    ];


    estadoInicial() {
        this.datatable.disableDelete = true;
        this.datatable.disableEdit = true;
        this.datatable.disableView = true;
        this.datatable.disableLoadingBlockUI = true;
        this.datatable.paginator = false;

    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    getAnalise() {
        this.routeSub = this.route.params.subscribe(params => {
            this.analise = new Analise();
            if (params['id']) {
                this.analiseService.find(params['id']).subscribe(analise => {
                    this.inicializaValoresAposCarregamento(analise);
                    this.analiseSharedDataService.analiseCarregada();
                });
            } else {
                this.analise.esforcoFases = [];
            }
        });
    }

    getTodasAnalisesBaseline() {
        this.analiseService.findAllBaseline().subscribe(dado => {
            this.analises = this.analiseService.convertJsonToAnalise(dado);

            this.getFuncoesTransacoes();
        }
        );

    }

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

    get analise(): Analise {
        this.analise = this.analiseSharedDataService.analise;
        return this.analiseSharedDataService.analise;
    }

    set analise(analise: Analise) {
        this.analiseSharedDataService.analise = analise;
    }

    getFuncoesTransacoes() {
        this.funcaoTransacaoFuncionalidade = [];

        this.analises.forEach(a => {
            if (a.sistema.id === this.analise.sistema.id) {
                a.funcaoTransacaos.forEach(b => {
                    this.funcaoTransacaoFuncionalidade.push(b);
                })
            }
        });
        this.fn = this.funcaoTransacaoFuncionalidade
    }

    getFuncoesTransacoesPorMod(nome: String) {
        this.funcaoTransacaoFuncionalidade = [];

        this.analises.forEach(a => {
            if (a.sistema.id === this.analise.sistema.id) {
                a.funcaoTransacaos.forEach(b => {
                    if (b.funcionalidade.modulo.nome == nome) {
                        this.funcaoTransacaoFuncionalidade.push(b);
                    }
                })
            }
        });
        this.fn = this.funcaoTransacaoFuncionalidade
    }


    getFuncoesTransacoesPorModEFunc(nome: String, nomeF: String) {
        this.funcaoTransacaoFuncionalidade = [];

        this.analises.forEach(a => {
            if (a.sistema.id === this.analise.sistema.id) {
                a.funcaoTransacaos.forEach(b => {
                    if (b.funcionalidade.modulo.nome == nome && b.funcionalidade.nome == nomeF) {
                        this.funcaoTransacaoFuncionalidade.push(b);
                    }
                })
            }
        });

        this.fn = this.funcaoTransacaoFuncionalidade
    }

    private inicializaValoresAposCarregamento(analiseCarregada: Analise) {
        this.analise = analiseCarregada;
        this.setSistamaOrganizacao(analiseCarregada.organizacao);
        this.setManual(analiseCarregada.manual);
        this.carregaFatorAjusteNaEdicao();
        this.carregarModulosQuandoTiverSistemaDisponivel();
        this.subscribeFuncionalideBaseline();
    }

    setSistamaOrganizacao(org: Organizacao) {
        this.contratos = org.contracts;
        this.sistemaService.findAllSystemOrg(org.id).subscribe((res: ResponseWrapper) => {
            this.sistemas = res.json;
        });
        this.setEquipeOrganizacao(org);
    }

    setManual(manual: Manual) {
        if (manual) {
            this.nomeManual = manual.nome;
            this.carregarEsforcoFases(manual);
            this.carregarMetodosContagem(manual);
            this.inicializaFatoresAjuste(manual);
        }
    }

    setEquipeOrganizacao(org: Organizacao) {
        this.contratos = org.contracts;
        this.equipeService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
            this.equipeResponsavel = res.json;
            if (this.equipeResponsavel !== null) {
                this.hideShowSelectEquipe = false;
            }
        });
    }

    private carregaFatorAjusteNaEdicao() {
        const fatorAjuste: FatorAjuste = this.analise.fatorAjuste;
        if (fatorAjuste) {
            const fatorAjusteSelectItem: SelectItem["value"]
                = _.find(this.fatoresAjuste, { value: { id: fatorAjuste.id } });
            this.analise.fatorAjuste = fatorAjusteSelectItem;
        }
    }

    private carregarEsforcoFases(manual: Manual) {
        this.esforcoFases = _.cloneDeep(manual.esforcoFases);
    }

    private carregarMetodosContagem(manual: Manual) {
        this.metodosContagem = [
            {
                value: MessageUtil.DETALHADA,
                label: this.getLabel('Analise.Analise.metsContagens.DETALHADA_IFPUG')
            },
            {
                value: MessageUtil.INDICATIVA,
                label: this.getLabelValorVariacao(this.getLabel('Analise.Analise.metsContagens.INDICATIVA_NESMA'), manual.valorVariacaoIndicativaFormatado)
            },
            {
                value: MessageUtil.ESTIMADA,
                label: this.getLabelValorVariacao(this.getLabel('Analise.Analise.metsContagens.ESTIMADA_NESMA'), manual.valorVariacaoEstimadaFormatado)
            }
        ];
    }

    private inicializaFatoresAjuste(manual: Manual) {
        const faS: FatorAjuste[] = _.cloneDeep(this.analise.manual.fatoresAjuste);
        this.fatoresAjuste =
            faS.map(fa => {
                const label = FatorAjusteLabelGenerator.generate(fa);
                return { label: label, value: fa };
            });
        this.fatoresAjuste.unshift(this.fatorAjusteNenhumSelectItem);
    }

    private getLabelValorVariacao(label: string, valorVariacao: number): string {
        return label + ' - ' + valorVariacao + '%';
    }

    private carregarModulosQuandoTiverSistemaDisponivel() {
        const sistemaId = this.analise.sistema.id;
        this.sistemaService.find(sistemaId).subscribe((sistemaRecarregado: Sistema) => {
            this.recarregarSistema(sistemaRecarregado);
            this.modulos = sistemaRecarregado.modulos;
        });
        this.changeDetectorRef.detectChanges();
    }

    private recarregarSistema(sistemaRecarregado: Sistema) {
        this.analiseSharedDataService.analise.sistema = sistemaRecarregado;
        this.modulos = sistemaRecarregado.modulos;
    }

    private subscribeFuncionalideBaseline() {
        this.funcaoDadosService.dataModd$.subscribe(
            (data: Funcionalidade) => {
                this.funcionalidades = data.modulo.funcionalidades;
                this.selecionarModuloBaseline(data.modulo.id, data.id);
            });
    }

    private selecionarModuloBaseline(moduloId: number, funcionalideId: number) {
        this.moduloSelecionado = _.find(this.modulos, { 'id': moduloId });
        this.funcionalidadeSelecionada = _.find(this.funcionalidades, { 'id': funcionalideId });
    }

    moduloSelected(modulo: Modulo) {
        this.moduloSelecionado = modulo;
        this.deselecionaFuncionalidadeSeModuloSelecionadoForDiferente();

        const moduloId = modulo.id;
        this.funcionalidadeService.findFuncionalidadesByModulo(moduloId).subscribe((funcionalidades: Funcionalidade[]) => {
            this.funcionalidades = funcionalidades;
        });
        this.moduloSelectedEvent.emit(modulo);
    }

    funcionalidadeSelected(funcionalidade: Funcionalidade) {
        this.funcionalidadeAtual = funcionalidade;
    }
    private deselecionaFuncionalidadeSeModuloSelecionadoForDiferente() {
        if (this.moduloSelecionado.id !== this.oldModuloSelectedId) {
            this.funcionalidadeSelecionada = undefined;
        }
    }

    performSearch() {
        this.recarregarDataTable();
    }

    montarFuncoesTransacao() {
        if (this.datatable.selectedRow != undefined) {
            this.datatable.selectedRow.map(ft => {
                let value: FuncaoTransacao = _.cloneDeep(ft);
                value.id = undefined;
                value.ders.map(vd => {
                    vd.id = undefined;
                })
                value.alrs.map(vd => {
                    vd.id = undefined;
                })
                if (this.novoDeflator !== undefined) {
                    value.fatorAjuste = this.novoDeflator;
                    value = CalculadoraTransacao.calcular(this.analise.metodoContagem, value, this.analise.manual)
                }
                this.validarFT(value);
            });
        }
    }

    public recarregarDataTable() {
        if (this.moduloSelecionado != undefined && this.funcionalidadeAtual == undefined) {
            this.getFuncoesTransacoesPorMod(this.moduloSelecionado.nome);
        } else if (this.moduloSelecionado != undefined && this.funcionalidadeAtual != undefined) {
            this.getFuncoesTransacoesPorModEFunc(this.moduloSelecionado.nome, this.funcionalidadeAtual.nome);
        } else {
            this.getFuncoesTransacoes();
        }
    }

    public limparPesquisa(modDropDown, funcDropDown) {
        this.limparModAndFunc(modDropDown, funcDropDown);
        this.getFuncoesTransacoes();
    }

    save() {
        this.validaCamposObrigatorios();
        if (this.verificarCamposObrigatorios()) {
            this.analiseService.update(this.analise).subscribe(() => {
                this.pageNotificationService.addSuccessMsg(this.isEdit ? this.getLabel('Analise.Analise.Mensagens.msgRegistroSalvoSucesso') : this.getLabel('Analise.Analise.Mensagens.msgDadosAlteradosSucesso'));
                this.diasGarantia = this.analise.contrato.diasDeGarantia;
            });
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

    private verificarCamposObrigatorios(): boolean {
        let isValid = true;

        if (!this.analise.identificadorAnalise) {
            this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgINFORME_IDENTIFICADOR'));
            isValid = false;
            return isValid;
        }
        if (!this.analise.contrato) {
            this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgSELECIONE_CONTRATO_CONTINUAR'));
            isValid = false;
            return isValid;
        }
        if (!this.analise.dataCriacaoOrdemServico) {
            this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgINFORME_DATA_ORDEM_SERVICO'));
            isValid = false;
            return isValid;
        }
        if (!this.analise.metodoContagem) {
            this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgINFORME_METODO_CONTAGEM'));
            isValid = false;
            return isValid;
        }
        if (!this.analise.tipoAnalise) {
            this.pageNotificationService.addInfoMsg(this.getLabel('Analise.Analise.Mensagens.msgINFORME_TIPO_CONTAGEM'));
            isValid = false;
            return isValid;
        }

        return isValid;
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

    mudarDeflator(event) {
        this.novoDeflator = event;
    }

    calcularComNovoDeflator(funcao: FuncaoTransacao) {
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.metodoContagem,
            funcao,
            this.analise.contrato.manual);
        this.funcoesTransacaoList.push(funcaoTransacaoCalculada);
    }

    retornarParaTelaDeFT(modDropDown, funcDropDown) {
        this.limparModAndFunc(modDropDown, funcDropDown)
        this.funcaoTransacaoService.display.next(false);  
    }

    limparModAndFunc(modDropDown, funcDropDown){
        modDropDown.clear(null);
        funcDropDown.clear(null);
        this.moduloSelecionado = undefined;
        this.funcionalidadeSelecionada = undefined;
    }

    validarFT(funcao: FuncaoTransacao) {
        // this.validarFuncaoTransacaos(this.currentFuncaoTransacao).then(resolve => {
        //     if (resolve) {
                this.pageNotificationService.addCreateMsgWithName(funcao.name);
                this.analise.addFuncaoTransacao(funcao);
                this.estadoInicial();
                this.save();
        //     } else {
        //         this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.FuncaoTransacao.Mensagens.msgRegistroCadastrado'));
        //     }
        // });
    }

    validarFuncaoTransacaos(ft: FuncaoTransacao) {
        return new Promise(resolve => {
            if (this.analise.funcaoTransacaos) {
                if (this.analise.funcaoTransacaos.length === 0) {
                    return resolve(true);
                }
                this.analise.funcaoTransacaos.forEach((data, index) => {
                        if (data.comprar(ft)) {
                            return resolve(false);
                        }
                        if (!this.analise.funcaoTransacaos[index + 1]) {
                            return resolve(true);
                        }
                });
            }
        });
    }

}
