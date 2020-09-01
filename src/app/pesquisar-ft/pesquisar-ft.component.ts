import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, Input} from '@angular/core';
import {MessageUtil} from '../util/message.util';
import {SelectItem} from 'primeng/primeng';
import {Analise, AnaliseService} from '../analise';
import {Organizacao} from '../organizacao';
import {Contrato} from '../contrato';
import {Sistema, SistemaService} from '../sistema';
import {EsforcoFase} from '../esforco-fase';
import {TipoEquipeService, TipoEquipe} from '../tipo-equipe';
import {FatorAjuste} from '../fator-ajuste';
import {FatorAjusteLabelGenerator} from '../shared/fator-ajuste-label-generator';
import * as _ from 'lodash';
import {Modulo} from '../modulo';
import {FuncaoDadosService} from '../funcao-dados/funcao-dados.service';

import {Funcionalidade, FuncionalidadeService} from '../funcionalidade';
import {FuncaoTransacao} from '../funcao-transacao';
import {CalculadoraTransacao, Calculadora} from '../analise-shared';
import {FuncaoTransacaoService} from '../funcao-transacao/funcao-transacao.service';
import {BaselineService} from '../baseline';
import {Router} from '@angular/router';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { AnaliseSharedDataService } from '../shared/analise-shared-data.service';
import { BlockUiService } from '@nuvem/angular-base';
import { FuncaoDados } from '../funcao-dados';
import { Rlr } from '../rlr/rlr.model';

@Component({
    selector: 'app-pesquisar-ft',
    templateUrl: './pesquisar-ft.component.html',
})
export class PesquisarFtComponent implements OnInit {

    @Input()
    isFuncaoDados: Boolean = false;

    translateSubscriptions: Subscription[] = [];

    enviarParaBaseLine: boolean;

    disableFuncaoTrasacao: boolean;

    query: String = '*';

    modPesquisa = true;

    funcPesquisa = true;

    deflaPesquisa = true;

    hideShowQuantidade = true;

    isEdit: boolean;

    disableAba: boolean;

    currentFuncaoTransacao: FuncaoTransacao;

    private oldModuloSelectedId = -1;

    organizacoes: Organizacao[];

    @ViewChild(DatatableComponent) datatable: DatatableComponent;

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

    equipeResponsavel: TipoEquipe[] = [];

    novoDeflator: FatorAjuste;

    quantidadeINM = 1;

    moduloSelecionado: Modulo;

    funcionalidadeAtual: Funcionalidade;

    funcionalidadeSelecionada: Funcionalidade;

    basilineAnaliticosList: any;

    erroUnitario = false;

    deflaPadrao: SelectItem = {label: 'Não Alterar', value: 'original-bAsis'};


    constructor(
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
        private blockUiService: BlockUiService,
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
        // this.datatable.editable = true;
        // this.datatable.paginator = false;

    }

    getLabel(label) {
        return label;
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
        this.sistemaService.findAllSystemOrg(org.id).subscribe((res) => {
            this.sistemas = res;
            this.contratos = org.contracts;
            this.setEquipeOrganizacao(org);
        });
    }

    setEquipeOrganizacao(org: Organizacao) {
        this.equipeService.findAllByOrganizacaoId(org.id).subscribe((res) => {
            this.equipeResponsavel = res;
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

    montarFuncoes() {
        if (!(this.isFuncaoDados)) {
            const getFuncaoTransacoes: Observable<FuncaoTransacao>[] = [];
            const saveFuncaoTransacoes: Observable<FuncaoTransacao>[] = [];
            if (!(this.novoDeflator)) {
                this.deflaPesquisa = false;
            } else if (this.novoDeflator.tipoAjuste === 'UNITARIO' && this.quantidadeINM <= 0 ) {
                this.erroUnitario = true;
            } else {
                this.erroUnitario = false;
                this.deflaPesquisa = true;
                this.selections.forEach(ft => {
                    this.blockUiService.show();
                    getFuncaoTransacoes.push(this.funcaoTransacaoService.getById(ft.idfuncaodados));
                });
                forkJoin(getFuncaoTransacoes).subscribe(result => {
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
                            if (this.novoDeflator.tipoAjuste === 'UNITARIO') {
                                funcaoTransacaoResp.quantidade = this.quantidadeINM;
                            }
                            funcaoTransacaoResp = new FuncaoTransacao().copyFromJSON(funcaoTransacaoResp);
                            funcaoTransacaoResp = CalculadoraTransacao.calcular(
                                this.analise.metodoContagem,
                                funcaoTransacaoResp,
                                this.analise.manual);
                        }
                        this.validaCamposObrigatorios();
                        if (this.verificarCamposObrigatorios()) {
                            this.blockUiService.show();
                            saveFuncaoTransacoes.push(this.funcaoTransacaoService.create(funcaoTransacaoResp, this.analise.id));
                        }
                    });
                forkJoin(saveFuncaoTransacoes).subscribe(
                        response => {
                            response.forEach(() => {
                                this.pageNotificationService.addSuccessMessage(
                                    this.isEdit ? this.getLabel('Informe o campo Identificador da Analise para continuar') :
                                        this.getLabel('Dados alterados com sucesso!'));
                                this.diasGarantia = this.analise.contrato.diasDeGarantia;
                            });
                        this.analiseService.updateSomaPf(this.analise.id).subscribe();
                        this.blockUiService.hide();
                        this.retornarParaTelaDeFT();
                    });

                });
            }
        } else {
            const getFuncaoDados: Observable<FuncaoDados>[] = [];
            const saveFuncaoDados: Observable<FuncaoDados>[] = [];
            if (!(this.novoDeflator)) {
                this.deflaPesquisa = false;
            } else if (this.novoDeflator.tipoAjuste === 'UNITARIO' && this.quantidadeINM <= 0 ) {
                this.erroUnitario = true;
            } else {
                this.erroUnitario = false;
                this.deflaPesquisa = true;
                this.selections.forEach(ft => {
                    this.blockUiService.show();
                    getFuncaoDados.push(this.funcaoDadosService.getById(ft.idfuncaodados));
                });
                forkJoin(getFuncaoDados).subscribe(result => {
                    result.forEach(funcaoDadosResp => {
                        funcaoDadosResp['id'] = undefined;
                        funcaoDadosResp.ders.forEach(der => {
                            der.id = undefined;
                        });
                        funcaoDadosResp.rlrs.forEach(rlr => {
                            rlr.id = undefined;
                        });
                        if (this.novoDeflator != null) {
                            funcaoDadosResp.fatorAjuste = this.novoDeflator;
                            if (this.novoDeflator.tipoAjuste === 'UNITARIO') {
                                funcaoDadosResp.quantidade = this.quantidadeINM;
                            }
                            funcaoDadosResp = new FuncaoDados().copyFromJSON(funcaoDadosResp);
                            funcaoDadosResp = Calculadora.calcular(
                                this.analise.metodoContagem,
                                funcaoDadosResp,
                                this.analise.manual);
                        }
                        this.validaCamposObrigatorios();
                        if (this.verificarCamposObrigatorios()) {
                            this.blockUiService.show();
                            saveFuncaoDados.push(this.funcaoDadosService.create(funcaoDadosResp, this.analise.id));
                        }
                    });
                forkJoin(saveFuncaoDados).subscribe(
                        response => {
                            response.forEach(() => {
                                this.pageNotificationService.addSuccessMessage(
                                    this.isEdit ? this.getLabel('Informe o campo Identificador da Analise para continuar') :
                                        this.getLabel('Dados alterados com sucesso!'));
                                this.diasGarantia = this.analise.contrato.diasDeGarantia;
                            });
                        this.analiseService.updateSomaPf(this.analise.id).subscribe();
                        this.blockUiService.hide();
                    });

                });
            }
        }
    }

    public recarregarDataTable() {
        if (this.isFuncaoDados) {
            if ((this.moduloSelecionado !== null) && (this.funcionalidadeAtual === null)) {
                this.blockUiService.show();
                this.funcaoDadosService.getFuncaoDadosByModuloOrFuncionalidade(this.moduloSelecionado.id).subscribe(value => {
                    this.blockUiService.hide();
                    this.fn = value;
                });
            } else if (this.moduloSelecionado !== undefined && this.funcionalidadeAtual !== undefined) {
                this.blockUiService.show();
                this.funcaoDadosService.getFuncaoDadosByModuloOrFuncionalidade(this.moduloSelecionado.id, this.funcionalidadeAtual.id)
                .subscribe(value => {
                    this.blockUiService.hide();
                    this.fn = value;
                });
            } else {
                this.getFuncoesTransacoes();
            }


        } else {

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
    }

    public limparPesquisa(modDropDown, funcDropDown, deflaDropDown) {
        this.limparModAndFunc(modDropDown, funcDropDown, deflaDropDown);
        this.getFuncoesTransacoes();
    }

    save(funcao: FuncaoTransacao) {
        this.validaCamposObrigatorios();
        if (this.verificarCamposObrigatorios()) {
            this.funcaoTransacaoService.create(funcao, this.analise.id).subscribe(() => {
                this.pageNotificationService.addSuccessMessage(
                    this.isEdit ? this.getLabel('msgRegistroSalvoSucesso') :
                        this.getLabel('msgDadosAlteradosSucesso'));
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
            this.pageNotificationService.addInfoMessage(this.getLabel('Informe o campo Identificador da Analise para continuar'));
            isValid = false;
            return isValid;
        }
        if (!this.analise.contrato) {
            this.pageNotificationService.addInfoMessage(this.getLabel('Informe o Contrato para continuar'));
            isValid = false;
            return isValid;
        }
        if (!this.analise.dataCriacaoOrdemServico) {
            this.pageNotificationService.addInfoMessage(this.getLabel('Informe a data de criação da ordem de serviço para continuar'));
            isValid = false;
            return isValid;
        }
        if (!this.analise.metodoContagem) {
            this.pageNotificationService.addInfoMessage(this.getLabel('Informe o Método de Contagem para continuar'));
            isValid = false;
            return isValid;
        }
        if (!this.analise.tipoAnalise) {
            this.pageNotificationService.addInfoMessage(this.getLabel('Informe o Tipo de Contagem para continuar'));
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

    mudarDeflator(event: FatorAjuste) {
        this.novoDeflator = event;
        if (event.tipoAjuste === 'UNITARIO') {
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
        this.pageNotificationService.addCreateMsg(funcao.name);
        this.analise.addFuncaoTransacao(funcao);
        this.estadoInicial();
        this.save(funcao);
    }
}
