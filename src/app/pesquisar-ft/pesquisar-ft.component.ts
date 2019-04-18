import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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

@Component({
  selector: 'app-pesquisar-ft',
  templateUrl: './pesquisar-ft.component.html',
})
export class PesquisarFtComponent implements OnInit, OnDestroy {

  private routeSub: Subscription;
  
  organizacoes: Organizacao[];
  
  modulos: Modulo[];

  contratos: Contrato[];

  sistemas: Sistema[];

  esforcoFases: EsforcoFase[] = [];

  metodosContagem: SelectItem[] = [];

  fatoresAjuste: SelectItem[] = [];

  equipeResponsavel: SelectItem[] = [];

  manual: Manual;

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

  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }


  private inicializaValoresAposCarregamento(analiseCarregada: Analise) {
    this.analise = analiseCarregada;
    this.setSistamaOrganizacao(analiseCarregada.organizacao);
    this.setManual(analiseCarregada.manual);
    this.carregaFatorAjusteNaEdicao();
    this.carregarModulosQuandoTiverSistemaDisponivel();
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
      const fatorAjusteSelectItem: SelectItem
          = _.find(this.fatoresAjuste, { value: { id: fatorAjuste.id } });
      this.analise.fatorAjuste = fatorAjusteSelectItem.value;
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

}
