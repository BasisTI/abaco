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
import { FileSaver } from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

    moduloSelecionado: Modulo = new Modulo();

    funcionalidadeAtual: Funcionalidade = new Funcionalidade();

    funcionalidadeSelecionada: Funcionalidade = new Funcionalidade();

    basilineAnaliticosList: any;

    erroUnitario = false;

    deflaPadrao: SelectItem = {label: 'Não Alterar', value: 'original-bAsis'};

    nameSearch: String;

    cols: any[];

    exportColumns: any[];

    files: any[] = []


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
        this.cols = [
            { field: 'nome', header: 'Módulo' },
            { field: 'nomeFuncionalidade', header: 'Funcionalidade' },
            { field: 'name', header: 'Nome' },
            { field: 'classificacao', header: 'Classificação' }
        ];
        this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
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

        const isContratoSelected = this.analiseSharedDataService.isContratoSelected();
        if (isContratoSelected) {
            if (this.fatoresAjuste.length === 0) {
                this.inicializaFatoresAjuste();
            }
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
        this.funcionalidades = sistemaRecarregado.modulos[0].funcionalidades
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
                this.funcionalidadeAtual = new Funcionalidade();
            });
        }
    }

    funcionalidadeSelected(funcionalidade: Funcionalidade) {
        this.funcionalidadeAtual = funcionalidade;
    }

    private deselecionaFuncionalidadeSeModuloSelecionadoForDiferente() {
        if (this.moduloSelecionado && this.moduloSelecionado.id !== this.oldModuloSelectedId) {
                this.funcionalidadeSelecionada = new Funcionalidade();
        }
    }


    performSearch() {
        this.recarregarDataTable();
    }

    montarFuncoes() {
        if (!(this.novoDeflator)) {
            this.deflaPesquisa = false;
            this.pageNotificationService.addErrorMessage('Deflator é um campo obrigatório.');
        } else if (this.novoDeflator.tipoAjuste === 'UNITARIO' && this.quantidadeINM <= 0 ) {
            this.erroUnitario = true;
        } else if (!(this.selections) || this.selections.length <= 0 ) {
            this.pageNotificationService.addErrorMessage('É obrigatório selecionar uma Função.');
        } else {
            if (!(this.isFuncaoDados)) {
                const getFuncaoTransacoes: Observable<FuncaoTransacao>[] = [];
                const saveFuncaoTransacoes: Observable<FuncaoTransacao>[] = [];
                let lstToInclude: Observable<Boolean>[] = [];
                this.erroUnitario = false;
                this.deflaPesquisa = true;

                this.selections.forEach(select => {
                    this.blockUiService.show();
                    lstToInclude.push(
                        this.funcaoTransacaoService.existsWithName(
                            select.name,
                            this.analise.id,
                            select.idFuncionalidade,
                            select.idModulo,
                            ));
                });
                forkJoin(lstToInclude).subscribe(respLStInclude => {
                    respLStInclude.forEach((include, index) => {
                        this.selections[index].isInclude = !include;
                    });
                    this.selections.forEach(ft => {
                        if (ft.isInclude) {
                            this.blockUiService.show();
                            getFuncaoTransacoes.push(this.funcaoTransacaoService.getById(ft.idfuncaodados));
                        } else {
                            this.pageNotificationService.addErrorMessage(
                                'Já existe uma função com o nome "' + ft.name +
                                 '" na funcionalidade "' + ft.nomeFuncionalidade + '".');
                        }
                    });
                    forkJoin(getFuncaoTransacoes).subscribe(result => {
                        result.forEach(funcaoTransacaoResp => {
                            funcaoTransacaoResp['id'] = undefined;
                            if (this.analise.metodoContagem === 'ESTIMADA' || this.analise.metodoContagem === 'INDICATIVA') {
                                funcaoTransacaoResp.ders = [];
                                funcaoTransacaoResp.alrs = [];
                            } else {
                                funcaoTransacaoResp.ders.forEach(vd => {
                                    vd.id = undefined;
                                });
                                funcaoTransacaoResp.alrs.forEach(vd => {
                                    vd.id = undefined;
                                });
                            }
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
                                funcaoTransacaoResp.sustantation = "";
                                saveFuncaoTransacoes.push(this.funcaoTransacaoService.create(funcaoTransacaoResp, this.analise.id, this.files));
                            }
                        });
                        forkJoin(saveFuncaoTransacoes).subscribe(
                            response => {
                                response.forEach((ftCreated) => {
                                    this.pageNotificationService.addCreateMsg(ftCreated.name);
                                });
                            this.analiseService.updateSomaPf(this.analise.id).subscribe();
                            this.blockUiService.hide();
                        });
                    });
                });
            } else {
                const getFuncaoDados: Observable<FuncaoDados>[] = [];
                const saveFuncaoDados: Observable<FuncaoDados>[] = [];
                let lstToInclude: Observable<Boolean>[] = [];
                this.erroUnitario = false;
                this.deflaPesquisa = true;
                this.selections.forEach(select => {
                    this.blockUiService.show();
                    lstToInclude.push(
                        this.funcaoDadosService.existsWithName(
                            select.name,
                            this.analise.id,
                            select.idFuncionalidade,
                            select.idModulo,
                            ));
                });
                forkJoin(lstToInclude).subscribe(respLStInclude => {
                    respLStInclude.forEach((include, index) => {
                        this.selections[index].isInclude = !include;
                    });
                    this.selections.forEach(ft => {
                        if (ft.isInclude) {
                            this.blockUiService.show();
                            getFuncaoDados.push(this.funcaoDadosService.getById(ft.idfuncaodados));
                        } else {
                            this.pageNotificationService.addErrorMessage(
                                'Já existe uma função com o nome "' + ft.name +
                                    '" na funcionalidade "' + ft.nomeFuncionalidade + '".');
                        }
                    });

                    forkJoin(getFuncaoDados).subscribe(result => {
                        result.forEach(funcaoDadosResp => {
                            funcaoDadosResp['id'] = undefined;
                            if (this.analise.metodoContagem === 'ESTIMADA' || this.analise.metodoContagem === 'INDICATIVA') {
                                funcaoDadosResp.ders = [];
                                funcaoDadosResp.rlrs = [];
                            } else {
                                funcaoDadosResp.ders.forEach(der => {
                                    der.id = undefined;
                                });
                                funcaoDadosResp.rlrs.forEach(rlr => {
                                    rlr.id = undefined;
                                });
                            }
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
                                funcaoDadosResp.sustantation = "";
                                saveFuncaoDados.push(this.funcaoDadosService.create(funcaoDadosResp, this.analise.id, this.files));
                            }
                        });
                        forkJoin(saveFuncaoDados).subscribe(
                                response => {
                                    response.forEach((fdCreated) => {
                                        this.pageNotificationService.addCreateMsg(fdCreated.name);
                                    });
                                this.analiseService.updateSomaPf(this.analise.id).subscribe();
                                this.blockUiService.hide();
                            });
                        });
                    });
            }
        }
    }

    public recarregarDataTable() {
        this.funcionalidadeAtual.id = this.funcionalidadeAtual && this.funcionalidadeAtual.id ? this.funcionalidadeAtual.id : 0;
        this.moduloSelecionado.id = this.moduloSelecionado && this.moduloSelecionado.id ? this.moduloSelecionado.id : 0;
        this.nameSearch = this.nameSearch ? this.nameSearch : '';
        if (this.isFuncaoDados) {
            this.blockUiService.show();
            this.funcaoDadosService.getFuncaoDadosByModuloOrFuncionalidade(this.analise.sistema.id, this.nameSearch, this.moduloSelecionado.id,  this.funcionalidadeAtual.id)
            .subscribe(value => {
                this.blockUiService.hide();
                this.fn = value;
            });
        } else {
            this.blockUiService.show();
            this.funcaoTransacaoService.getFuncaoTransacaoByModuloOrFuncionalidade(this.analise.sistema.id, this.nameSearch, this.moduloSelecionado.id,  this.funcionalidadeAtual.id)
            .subscribe(value => {
                this.blockUiService.hide();
                this.fn = value;
            });
        }
    }

    public limparPesquisa() {
        if (this.moduloSelecionado && this.moduloSelecionado.id) {
            this.moduloSelecionado = new Modulo();
        }
        if (this.funcionalidadeSelecionada && this.funcionalidadeSelecionada.id) {
            this.funcionalidadeSelecionada = new Funcionalidade();
        }
        if (this.funcionalidadeAtual && this.funcionalidadeAtual.id) {
            this.funcionalidadeAtual = new Funcionalidade();
        }
        this.nameSearch = '';
        this.deflaPadrao = undefined;
    }

    save(funcao: FuncaoTransacao) {
        this.validaCamposObrigatorios();
        if (this.verificarCamposObrigatorios()) {
            this.funcaoTransacaoService.create(funcao, this.analise.id, this.files).subscribe(() => {
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
        return isContratoSelected;
    }

    mudarDeflator(event: FatorAjuste) {
        this.novoDeflator = event;
        if ( event) {
            if (event.tipoAjuste === 'UNITARIO') {
                this.hideShowQuantidade = false;
            } else {
                this.hideShowQuantidade = true;
            }
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

    validarFT(funcao: FuncaoTransacao) {
        this.pageNotificationService.addCreateMsg(funcao.name);
        this.analise.addFuncaoTransacao(funcao);
        this.estadoInicial();
        this.save(funcao);
    }

    exportPdf() {
        if (this.fn && this.fn.length > 0) {
            const doc = new jsPDF('p', 'pt');
            doc['autoTable'](this.exportColumns, this.fn);
            doc.save('funcoes.pdf');
        } else {
            this.pageNotificationService.addErrorMessage('Não ha funções para exportar.');
        }

    }

    exportExcel() {
        if (this.fn && this.fn.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(this.fn);
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'funcoes');
        } else {
            this.pageNotificationService.addErrorMessage('Não ha funções para exportar.');
        }
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

}
