import { Component, OnInit, OnDestroy, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageUtil } from '../util/message.util';
import { SelectItem } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Rx';
import { AnaliseService, Analise } from '../analise';
import { AnaliseSharedDataService, ResponseWrapper } from '../shared';
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

@Component({
  selector: 'app-pesquisar-ft',
  templateUrl: './pesquisar-ft.component.html',
})
export class PesquisarFtComponent implements OnInit, OnDestroy {

  private routeSub: Subscription;

  private oldModuloSelectedId = -1;

  organizacoes: Organizacao[];

  modulos: Modulo[];

  contratos: Contrato[];

  sistemas: Sistema[];

  funcionalidades: Funcionalidade[];

  esforcoFases: EsforcoFase[] = [];

  metodosContagem: SelectItem[] = [];

  fatoresAjuste: SelectItem[] = [];

  equipeResponsavel: SelectItem[] = [];

  manual: Manual;

  moduloSelecionado: Modulo;

  funcionalidadeSelecionada: Funcionalidade;

  @Output()
  moduloSelectedEvent = new EventEmitter<Modulo>();

  nomeManual = this.getLabel('Analise.SelecioneUmContrato');

  private fatorAjusteNenhumSelectItem = { label: MessageUtil.NENHUM, value: undefined };

  public hideShowSelectEquipe: boolean;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private analiseService: AnaliseService,
    private analiseSharedDataService: AnaliseSharedDataService,
    private sistemaService: SistemaService,
    private equipeService: TipoEquipeService,
    private changeDetectorRef: ChangeDetectorRef,
    private funcaoDadosService: FuncaoDadosService,
    private funcionalidadeService: FuncionalidadeService,


  ) { }

  ngOnInit() {
    this.getAnalise();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  tiposAnalise: SelectItem[] = [
    { label: MessageUtil.PROJETO_DESENVOLVIMENTO, value: MessageUtil.DESENVOLVIMENTO },
    { label: MessageUtil.PROJETO_MELHORIA, value: MessageUtil.MELHORIA },
    { label: MessageUtil.CONTAGEM_APLICACAO, value: MessageUtil.APLICACAO }
  ];



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

  set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  get funcoesTransacoes(): FuncaoTransacao[] {
    if (!this.analise.funcaoTransacaos) {
      return [];
    }
    return this.analise.funcaoTransacaos;
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
    const faS: FatorAjuste[] = _.cloneDeep(manual.fatoresAjuste);
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

  private deselecionaFuncionalidadeSeModuloSelecionadoForDiferente() {
    if (this.moduloSelecionado.id !== this.oldModuloSelectedId) {
      this.funcionalidadeSelecionada = undefined;
    }
  }

}
