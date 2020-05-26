import {DataTable} from 'primeng/datatable';
import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MessageUtil} from '../util/message.util';
import {SelectItem} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {Analise, AnaliseService} from '../analise';
import {AnaliseSharedDataService, PageNotificationService, ResponseWrapper} from '../shared';
import {Organizacao} from '../organizacao';
import {Contrato} from '../contrato';
import {Sistema, SistemaService} from '../sistema';
import {EsforcoFase} from '../esforco-fase';
import {TipoEquipeService} from '../tipo-equipe';
import {FatorAjuste} from '../fator-ajuste';
import {FatorAjusteLabelGenerator} from '../shared/fator-ajuste-label-generator';
import * as _ from 'lodash';
import {Modulo} from '../modulo';
import {FuncaoDadosService} from '../funcao-dados/funcao-dados.service';

import {Funcionalidade, FuncionalidadeService} from '../funcionalidade';
import {FuncaoTransacao} from '../funcao-transacao';
import {CalculadoraTransacao} from '../analise-shared';
import {FuncaoTransacaoService} from '../funcao-transacao/funcao-transacao.service';
import {BaselineService} from '../baseline';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {forEach} from '@angular/router/src/utils/collection';
import {Router} from '@angular/router';

@Component({
    selector: 'app-pesquisar-ft',
    templateUrl: './pesquisar-ft.component.html',
})
export class PesquisarFtComponent implements OnInit {

    translateSubscriptions: Subscription[] = [];

    enviarParaBaseLine: boolean;

    disableFuncaoTrasacao: boolean;

    query: String = '*';

    modPesquisa: boolean = true;

    funcPesquisa: boolean = true;

    deflaPesquisa: boolean = true;

    hideShowQuantidade: boolean = true;

    isEdit: boolean;

    disableAba: boolean;

    currentFuncaoTransacao: FuncaoTransacao;

    private oldModuloSelectedId = -1;

    organizacoes: Organizacao[];

    @ViewChild(DataTable) datatable: DataTable;

    selections: any[] = [];

    modulos: Modulo[];

    public validacaoCampos: boolean;

    diasGarantia: number;

    contratos: Contrato[];

    sistemas: Sistema[];

    funcionalidades: Funcionalidade[];

    arrayFt: any[] = [];

    fn: any[] = [];

    analises: Analise[];

    funcaoTransacaoFuncionalidade: FuncaoTransacao[] = [];

    funcaoTransacao: Funcionalidade[] = [];

    esforcoFases: EsforcoFase[] = [];

    metodosContagem: SelectItem[] = [];

    fatoresAjuste: SelectItem[] = [];

    equipeResponsavel: SelectItem[] = [];

    novoDeflator: FatorAjuste;

    quantidadeINM: number = 1;

    moduloSelecionado: Modulo;

    funcionalidadeAtual: Funcionalidade;

    funcionalidadeSelecionada: Funcionalidade;

    basilineAnaliticosList: any;

    erroUnitario: boolean = false;

    deflaPadrao: SelectItem = {label: 'Não Alterar', value: 'original-bAsis'};

    @BlockUI() blockUI: NgBlockUI;

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
        private baselineFT: BaselineService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.inicializaValoresAposCarregamento();
        this.analiseSharedDataService.analiseCarregada();
        this.estadoInicial();
    }

    tiposAnalise: SelectItem[] = [
        {label: MessageUtil.PROJETO_DESENVOLVIMENTO, value: MessageUtil.DESENVOLVIMENTO},
        {label: MessageUtil.PROJETO_MELHORIA, value: MessageUtil.MELHORIA},
        {label: MessageUtil.CONTAGEM_APLICACAO, value: MessageUtil.APLICACAO}
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
            default:
                return this.getLabel('Global.Mensagens.Nenhum');
        }
    }

    get analise(): Analise {
        return this.analiseSharedDataService.analise;
    }

    getFuncoesTransacoes() {
        this.funcaoTransacaoFuncionalidade = [];
        this.fn = [];
        this.funcaoTransacao = [];

        if (this.analises !== undefined) {
            this.analises.forEach(a => {
                if (a.sistema.id === this.analise.sistema.id) {
                    a.funcaoTransacaos.forEach(b => {
                        this.funcaoTransacaoFuncionalidade.push(b);
                    });
                }
            });
        }

        if (this.basilineAnaliticosList !== undefined) {
            this.basilineAnaliticosList.forEach(basilineAnalitico => {
                this.funcaoTransacaoFuncionalidade.forEach(funcaoTransacao => {
                    if (basilineAnalitico.idfuncaodados === funcaoTransacao.id) {
                        this.funcaoTransacao.push(funcaoTransacao);
                    }
                });
            });
        }

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
                if (ft.idfuncaodados === f.id && ft.nomeModulo === nome) {
                    this.funcaoTransacao.push(f);
                }
            });
        });
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
                if (ft.idfuncaodados === f.id && ft.nomeModulo === nome && ft.nomeFuncionalidade === nomeF) {
                    this.funcaoTransacao.push(f);
                }
            });
        });

        this.fn = this.funcaoTransacao;

    }

    private inicializaValoresAposCarregamento() {
        if (this.analise && this.analise.organizacao) {
            this.setSistamaOrganizacao(this.analise.organizacao);
            this.carregaFatorAjusteNaEdicao();
            this.subscribeFuncionalideBaseline();
        }
    }

    setSistamaOrganizacao(org: Organizacao) {
        this.sistemaService.findAllSystemOrg(org.id).subscribe((res: ResponseWrapper) => {
            this.sistemas = res.json;
            this.contratos = org.contracts;
            this.setEquipeOrganizacao(org);
        });
    }

    setEquipeOrganizacao(org: Organizacao) {
        this.equipeService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
            this.equipeResponsavel = res.json;
            this.contratos = org.contracts;
        });
    }

    private carregaFatorAjusteNaEdicao() {
        const fatorAjuste: FatorAjuste = this.analise.fatorAjuste;
        if (fatorAjuste) {
            const fatorAjusteSelectItem: SelectItem['value']
                = _.find(this.fatoresAjuste, {value: {id: fatorAjuste.id}});
            this.analise.fatorAjuste = fatorAjusteSelectItem;
        }
    }

    private inicializaFatoresAjuste() {
        const faS: FatorAjuste[] = _.cloneDeep(this.analise.manual.fatoresAjuste);
        this.fatoresAjuste =
            faS.map(fa => {
                const label = FatorAjusteLabelGenerator.generate(fa);
                return {label: label, value: fa};
            });
        this.carregarModulosQuandoTiverSistemaDisponivel();
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
        this.moduloSelecionado = _.find(this.modulos, {'id': moduloId});
        this.funcionalidadeSelecionada = _.find(this.funcionalidades, {'id': funcionalideId});
    }

    moduloSelected(modulo: Modulo) {
        this.moduloSelecionado = modulo;
        this.deselecionaFuncionalidadeSeModuloSelecionadoForDiferente();

        if (modulo !== undefined && modulo !== null) {
            const moduloId = modulo.id;
            this.funcionalidadeService.findFuncionalidadesDropdownByModulo(moduloId).subscribe((funcionalidades: Funcionalidade[]) => {
                this.funcionalidades = funcionalidades;
                this.funcionalidadeAtual = null;
            });
        }
    }

    funcionalidadeSelected(funcionalidade: Funcionalidade) {
        this.funcionalidadeAtual = funcionalidade;
    }

    private deselecionaFuncionalidadeSeModuloSelecionadoForDiferente() {
        if (this.moduloSelecionado !== undefined) {
            if (this.moduloSelecionado.id !== this.oldModuloSelectedId) {
                this.funcionalidadeSelecionada = null;
            }
        }

    }


    performSearch() {
        if (this.moduloSelecionado === undefined) {
            this.modPesquisa = false;
        } else {
            this.modPesquisa = true;
        }
        if (this.funcionalidadeAtual === undefined) {
            this.funcPesquisa = false;
        } else {
            this.funcPesquisa = true;
        }
        this.recarregarDataTable();
    }

    montarFuncoesTransacao() {
        const getFuncaoTransacoes: Observable<FuncaoTransacao>[] = [];
        const saveFuncaoTransacoes: Observable<FuncaoTransacao>[] = [];
        if (!(this.novoDeflator)) {
            this.deflaPesquisa = false;
        }else if(this.novoDeflator.tipoAjuste === 'UNITARIO'&& this.quantidadeINM <= 0 ){
            this.erroUnitario = true;
        } else {
            this.erroUnitario = false;
            this.deflaPesquisa = true;
            this.selections.forEach(ft => {
                getFuncaoTransacoes.push(this.funcaoTransacaoService.getById(ft.idfuncaodados));
            });
            Observable.forkJoin(getFuncaoTransacoes).subscribe(result => {
                result.forEach(funcaoTransacaoResp => {
                    funcaoTransacaoResp['id'] = undefined;
                    funcaoTransacaoResp.ders.forEach(vd => {
                        vd.id = undefined;
                    });
                    funcaoTransacaoResp.alrs.forEach(vd => {
                        vd.id = undefined;
                    });
                    if (this.novoDeflator != null) {
                        funcaoTransacaoResp.fatorAjuste = this.novoDeflator;
                        if(this.novoDeflator.tipoAjuste === 'UNITARIO'){
                            funcaoTransacaoResp.quantidade = this.quantidadeINM;
                        }
                        funcaoTransacaoResp = CalculadoraTransacao.calcular(this.analise.metodoContagem, funcaoTransacaoResp, this.analise.manual);
                    }
                    this.validaCamposObrigatorios();
                    if (this.verificarCamposObrigatorios()) {
                        saveFuncaoTransacoes.push(this.funcaoTransacaoService.create(funcaoTransacaoResp, this.analise.id));
                    }
                });
                Observable.forkJoin(saveFuncaoTransacoes).finally(() => {
                    this.blockUI.stop();
                }).subscribe(response => {
                    response.forEach(() => {
                        this.pageNotificationService.addSuccessMsg(
                            this.isEdit ? this.getLabel('Analise.Analise.Mensagens.msgRegistroSalvoSucesso') :
                                this.getLabel('Analise.Analise.Mensagens.msgDadosAlteradosSucesso'));
                        this.diasGarantia = this.analise.contrato.diasDeGarantia;
                    });
                    this.analiseService.updateSomaPf(this.analise.id).subscribe(()=>{this.blockUI.stop();})
                });

            });
        }
    }

    public recarregarDataTable() {
        if ((this.moduloSelecionado !== null) && (this.funcionalidadeAtual === null)) {
            this.funcaoTransacaoService.getFuncaoTransacaoByModuloOrFuncionalidade(this.moduloSelecionado.id).subscribe(value => {
                this.fn = value;
            });
        } else if (this.moduloSelecionado !== undefined && this.funcionalidadeAtual !== undefined) {
            this.funcaoTransacaoService.getFuncaoTransacaoByModuloOrFuncionalidade(this.moduloSelecionado.id, this.funcionalidadeAtual.id)
                .subscribe(value => {
                    this.fn = value;
                });
        } else {
            this.getFuncoesTransacoes();
        }
    }

    public limparPesquisa(modDropDown, funcDropDown, deflaDropDown) {
        this.limparModAndFunc(modDropDown, funcDropDown, deflaDropDown);
        this.getFuncoesTransacoes();
    }

    save(funcao: FuncaoTransacao) {
        this.validaCamposObrigatorios();
        if (this.verificarCamposObrigatorios()) {
            this.funcaoTransacaoService.create(funcao, this.analise.id).subscribe(() => {
                this.pageNotificationService.addSuccessMsg(
                    this.isEdit ? this.getLabel('Analise.Analise.Mensagens.msgRegistroSalvoSucesso') :
                        this.getLabel('Analise.Analise.Mensagens.msgDadosAlteradosSucesso'));
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

    mudarDeflator(event:FatorAjuste) {
        this.novoDeflator = event;
        if(event.tipoAjuste === 'UNITARIO'){
            this.hideShowQuantidade = false;
        } else {
            this.hideShowQuantidade = true;
        }
    }

    alterarQuatindade(event) {
       this.quantidadeINM = event;
    }

    calcularComNovoDeflator(funcao: FuncaoTransacao) {
        const funcaoTransacaoCalculada = CalculadoraTransacao.calcular(this.analise.metodoContagem,
            funcao,
            this.analise.contrato.manual);
    }

    retornarParaTelaDeFT() {
        location.reload();
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
        this.save(funcao);
    }
}
