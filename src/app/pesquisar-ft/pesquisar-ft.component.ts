import { DataTable } from 'primeng/datatable';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageUtil } from '../util/message.util';
import { SelectItem } from 'primeng/primeng';
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
import { CalculadoraTransacao } from '../analise-shared';
import { FuncaoTransacaoService } from '../funcao-transacao/funcao-transacao.service';
import { BaselineService } from '../baseline';

@Component({
    selector: 'app-pesquisar-ft',
    templateUrl: './pesquisar-ft.component.html',
})
export class PesquisarFtComponent implements OnInit, OnDestroy {

    translateSubscriptions: Subscription[] = [];

    enviarParaBaseLine: boolean;

    disableFuncaoTrasacao: boolean;

    query: String = "*";

    modPesquisa: boolean = true;

    funcPesquisa: boolean = true;

    deflaPesquisa: boolean = true;

    isEdit: boolean;

    disableAba: boolean;

    currentFuncaoTransacao: FuncaoTransacao;

    private oldModuloSelectedId = -1;

    organizacoes: Organizacao[];

    @ViewChild(DataTable) datatable: DataTable;

    selections: FuncaoTransacao[] = [];

    modulos: Modulo[];

    public validacaoCampos: boolean;

    diasGarantia: number;

    contratos: Contrato[];

    sistemas: Sistema[];

    funcionalidades: Funcionalidade[];

    arrayFt: any[] = [];

    fn: Funcionalidade[] = [];

    analises: Analise[];

    funcaoTransacaoFuncionalidade: FuncaoTransacao[] = [];

    funcaoTransacao: Funcionalidade[] = [];

    esforcoFases: EsforcoFase[] = [];

    metodosContagem: SelectItem[] = [];

    fatoresAjuste: SelectItem[] = [];

    equipeResponsavel: SelectItem[] = [];

    novoDeflator: FatorAjuste;

    moduloSelecionado: Modulo;

    funcionalidadeAtual: Funcionalidade;

    funcionalidadeSelecionada: Funcionalidade;

    basilineAnaliticosList: any;

    deflaPadrao: SelectItem = { label: "Não Alterar", value: "original-bAsis" };

    constructor(
        private translate: TranslateService,
        private analiseService: AnaliseService,
        private analiseSharedDataService: AnaliseSharedDataService,
        private sistemaService: SistemaService,
        private equipeService: TipoEquipeService,
        private changeDetectorRef: ChangeDetectorRef,
        private funcaoDadosService: FuncaoDadosService,
        private funcionalidadeService: FuncionalidadeService,
        private pageNotificationService: PageNotificationService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private baselineFT: BaselineService

    ) { }

    ngOnInit() {
        this.inicializaValoresAposCarregamento();
        this.analiseSharedDataService.analiseCarregada();
        this.estadoInicial();
    }

    ngOnDestroy() {
        this.translateSubscriptions.pop().unsubscribe();
    }

    tiposAnalise: SelectItem[] = [
        { label: MessageUtil.PROJETO_DESENVOLVIMENTO, value: MessageUtil.DESENVOLVIMENTO },
        { label: MessageUtil.PROJETO_MELHORIA, value: MessageUtil.MELHORIA },
        { label: MessageUtil.CONTAGEM_APLICACAO, value: MessageUtil.APLICACAO }
    ];


    estadoInicial() {
        this.datatable.editable = true;
        this.datatable.paginator = false;

    }

    getLabel(label) {
        let str: any;
        this.translateSubscriptions.push(this.translate.get(label).subscribe((res: string) => {
            str = res;
        }));
        return str;
    }

    getTodasAnalisesBaseline() {
        // TODO REMOVER REQUEST
        this.analiseService.findAllBaseline().subscribe(dado => {
            this.analises = this.analiseService.convertJsonToAnalise(dado);
            this.getBaselineAnalitico();
        }
        );

    }

    getBaselineAnalitico(){
        this.baselineFT.baselineAnaliticoFT(this.analise.sistema.id).subscribe(dado =>{
            this.basilineAnaliticosList = dado.json;
            this.getFuncoesTransacoes();
        });
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
        return this.analiseSharedDataService.analise;
    }

    getFuncoesTransacoes() {
        this.funcaoTransacaoFuncionalidade = [];
        this.fn = [];
        this.funcaoTransacao = [];

        if(this.analises != undefined){
            this.analises.forEach(a => {
                if (a.sistema.id === this.analise.sistema.id) {
                    a.funcaoTransacaos.forEach(b => {
                        this.funcaoTransacaoFuncionalidade.push(b);
                    });
                }
            });
        };
       
        if(this.basilineAnaliticosList != undefined){
            this.basilineAnaliticosList.forEach(basilineAnalitico => {
                this.funcaoTransacaoFuncionalidade.forEach(funcaoTransacao => {
                    if(basilineAnalitico.idfuncaodados == funcaoTransacao.id){
                        this.funcaoTransacao.push(funcaoTransacao);
                    }
                });
            });
        };
       
        this.fn = this.funcaoTransacao;
    }



    getFuncoesTransacoesPorMod(nome: String) {
        this.funcaoTransacaoFuncionalidade = [];
        this.fn = [];
        this.funcaoTransacao = [];

        this.analises.forEach(a => {
            if (a.sistema.id === this.analise.sistema.id) {
                a.funcaoTransacaos.forEach(b => {
                    this.funcaoTransacaoFuncionalidade.push(b);
                });
            }
        });

        this.basilineAnaliticosList.forEach(ft => {
            this.funcaoTransacaoFuncionalidade.forEach(f => {
                if(ft.idfuncaodados == f.id && ft.nomeModulo == nome){
                    this.funcaoTransacao.push(f);
                }
            })
        })
        this.fn = this.funcaoTransacao;
    }


    getFuncoesTransacoesPorModEFunc(nome: String, nomeF: String) {
        this.funcaoTransacaoFuncionalidade = [];
        this.fn = [];
        this.funcaoTransacao = [];

        this.analises.forEach(a => {
            if (a.sistema.id === this.analise.sistema.id) {
                a.funcaoTransacaos.forEach(b => {
                    this.funcaoTransacaoFuncionalidade.push(b);
                });
            }
        });

        this.basilineAnaliticosList.forEach(ft => {
            this.funcaoTransacaoFuncionalidade.forEach(f => {
                if(ft.idfuncaodados == f.id && ft.nomeModulo == nome && ft.nomeFuncionalidade == nomeF){
                    this.funcaoTransacao.push(f);
                }
            })
        })

        this.fn = this.funcaoTransacao;

    }

    private inicializaValoresAposCarregamento() {
        if(this.analise.organizacao){
            this.setSistamaOrganizacao(this.analise.organizacao);
        }
        this.carregaFatorAjusteNaEdicao();
        this.subscribeFuncionalideBaseline();
    }

    setSistamaOrganizacao(org: Organizacao) {
        this.contratos = org.contracts;
        this.sistemaService.findAllSystemOrg(org.id).subscribe((res: ResponseWrapper) => {
            this.sistemas = res.json;
        });
        this.setEquipeOrganizacao(org);
    }

    setEquipeOrganizacao(org: Organizacao) {
        this.contratos = org.contracts;
        this.equipeService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
            this.equipeResponsavel = res.json;
        });
    }

    private carregaFatorAjusteNaEdicao() {
        const fatorAjuste: FatorAjuste = this.analise.fatorAjuste;
        if (fatorAjuste) {
            const fatorAjusteSelectItem: SelectItem["value"]
                = _.find(this.fatoresAjuste, { value: { id: fatorAjuste.id } });
            this.analise.fatorAjuste = fatorAjusteSelectItem;
        }
        this.fatoresAjuste.unshift(this.deflaPadrao);
    }

    private inicializaFatoresAjuste() {
        const faS: FatorAjuste[] = _.cloneDeep(this.analise.manual.fatoresAjuste);
        this.fatoresAjuste =
            faS.map(fa => {
                const label = FatorAjusteLabelGenerator.generate(fa);
                return { label: label, value: fa };
            });
        this.carregarModulosQuandoTiverSistemaDisponivel();
        this.getTodasAnalisesBaseline();

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

        if (modulo != undefined && modulo != null) {
            const moduloId = modulo.id;
            this.funcionalidadeService.findFuncionalidadesDropdownByModulo(moduloId).subscribe((funcionalidades: Funcionalidade[]) => {
                this.funcionalidades = funcionalidades;
            });
        }
    }

    funcionalidadeSelected(funcionalidade: Funcionalidade) {
        this.funcionalidadeAtual = funcionalidade;
    }
    private deselecionaFuncionalidadeSeModuloSelecionadoForDiferente() {
        if (this.moduloSelecionado != undefined) {
            if (this.moduloSelecionado.id !== this.oldModuloSelectedId) {
                this.funcionalidadeSelecionada = undefined;
            }
        }

    }


    performSearch() {
        if (this.moduloSelecionado == undefined) {
            this.modPesquisa = false;
        } else {
            this.modPesquisa = true;
        }
        if (this.funcionalidadeAtual == undefined) {
            this.funcPesquisa = false;
        } else {
            this.funcPesquisa = true;
        }
        this.recarregarDataTable();
    }

    montarFuncoesTransacao() {
        if (this.novoDeflator === undefined) {
            this.deflaPesquisa = false;
        } else {
            this.deflaPesquisa = true;
            this.selections.forEach(ft => {
                let value: FuncaoTransacao = _.cloneDeep(ft);
                value.id = undefined;
                value.ders.forEach(vd => {
                    vd.id = undefined;
                });
                value.alrs.forEach(vd => {
                    vd.id = undefined;
                });
                if (this.novoDeflator != null) {
                    value.fatorAjuste = this.novoDeflator;
                    value = CalculadoraTransacao.calcular(this.analise.metodoContagem, value, this.analise.manual)
                }
                this.validarFT(value);
            });
        }
    }

    public recarregarDataTable() {
        if ( (this.moduloSelecionado != null) && (this.funcionalidadeAtual == null) ) {
            this.getFuncoesTransacoesPorMod(this.moduloSelecionado.nome);
        } else if (this.moduloSelecionado != undefined && this.funcionalidadeAtual != undefined) {
            this.getFuncoesTransacoesPorModEFunc(this.moduloSelecionado.nome, this.funcionalidadeAtual.nome);
        } else {
            this.getFuncoesTransacoes();
        }
    }

    public limparPesquisa(modDropDown, funcDropDown, deflaDropDown) {
        this.limparModAndFunc(modDropDown, funcDropDown, deflaDropDown);
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
                this.inicializaFatoresAjuste();
            }
        }
        return isContratoSelected;
    }

    mudarDeflator(event) {
        if (event == 'original-bAsis') {
            this.novoDeflator = null;
        } else {
            this.novoDeflator = event;
        }
    }

    calcularComNovoDeflator(funcao: FuncaoTransacao) {
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.metodoContagem,
            funcao,
            this.analise.contrato.manual);
    }

    retornarParaTelaDeFT(modDropDown, funcDropDown, deflaDropDown) {
        this.limparModAndFunc(modDropDown, funcDropDown, deflaDropDown)
        this.funcaoTransacaoService.display.next(false);
        this.getFuncoesTransacoes();
    }

    limparModAndFunc(modDropDown, funcDropDown, deflaDropDown) {
        modDropDown.clear(null);
        funcDropDown.clear(null);
        deflaDropDown.clear(undefined);
        this.moduloSelecionado = undefined;
        this.funcionalidadeSelecionada = undefined;
        this.deflaPadrao = undefined;
        this.modPesquisa = true;
        this.funcPesquisa = true;
    }

    validarFT(funcao: FuncaoTransacao) {
        this.pageNotificationService.addCreateMsgWithName(funcao.name);
        this.analise.addFuncaoTransacao(funcao);
        this.estadoInicial();
        this.save();
    }
}
