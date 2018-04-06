import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ResponseWrapper, BaseEntity, AnaliseSharedDataService, PageNotificationService } from '../shared';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { Contrato, ContratoService } from '../contrato';
import { Sistema, SistemaService } from '../sistema';
import { SelectItem } from 'primeng/primeng';

import * as _ from 'lodash';
import { EsforcoFase } from '../esforco-fase/index';
import { FatorAjuste } from '../fator-ajuste/index';
import { Manual, ManualService } from '../manual/index';
import { FatorAjusteLabelGenerator } from '../shared/fator-ajuste-label-generator';

import { TipoEquipe, TipoEquipeService } from '../tipo-equipe';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'jhi-analise-form',
  templateUrl: './analise-form.component.html'
})
export class AnaliseFormComponent implements OnInit, OnDestroy {

  isEdicao: boolean;

  isSaving: boolean;

  organizacoes: Organizacao[];

  contratos: Contrato[];

  sistemas: Sistema[];

  esforcoFases: EsforcoFase[] = [];

  metodosContagem: SelectItem[] = [];

  fatoresAjuste: SelectItem[] = [];

  equipeResponsavel: SelectItem[] = [];

  manuais: SelectItem[] = [];

  private fatorAjusteNenhumSelectItem = { label: 'Nenhum', value: undefined };

  /**
   * Método responsável por popular a combo de tipo de contagem.
  */
 tiposAnalise: SelectItem[] = [
    {label: 'Projeto de Desenvolvimento', value: 'DESENVOLVIMENTO'},
    {label: 'Projeto Melhoria', value: 'MELHORIA'},
    {label: 'Contagem de Aplicação (Baseline)', value: 'APLICACAO'}
  ];

  /**
   * Método responsável por popular a combo método de contagem.
  */
  metodoContagem: SelectItem[] = [
    {label: 'Detalhada (IFPUG)', value: 'Detalhada (IFPUG)'},
    {label: 'Indicativa (NESMA)', value: 'Indicativa (NESMA)'},
    {label: 'Estimada (NESMA)', value: 'Estimada (NESMA)'}
  ];

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private analiseService: AnaliseService,
    private organizacaoService: OrganizacaoService,
    private contratoService: ContratoService,
    private sistemaService: SistemaService,
    private analiseSharedDataService: AnaliseSharedDataService,
    private tipoEquipeService: TipoEquipeService,
    private pageNotificationService: PageNotificationService,
    private manualService: ManualService,
  ) { }

  ngOnInit() {
    this.analiseSharedDataService.init();
    this.isEdicao = false;
    this.isSaving = false;
    this.habilitarCamposIniciais();
    this.popularListaTipoEquipe();
    this.popularListaOrganizacao();
    this.popularListaManual();
    this.popularAnaliseCarregada();
  }

  /**
   * Método responsável por popular o objeto analise carregada.
  */
  popularAnaliseCarregada() {
    this.routeSub = this.route.params.subscribe(params => {
      this.analise = new Analise();
      if (params['id']) {
        this.isEdicao = true;
        this.analiseService.find(params['id']).subscribe(analise => {
          this.inicializaValoresAposCarregamento(analise);
          this.analiseSharedDataService.analiseCarregada();
        });
      } else {
        this.analise.esforcoFases = [];
      }
    });
  }

  /**
   * Método responsável por popular a lista dos tipos de equipe.
  */
  popularListaTipoEquipe() {
    this.tipoEquipeService.query().subscribe((res: ResponseWrapper) => {
      this.equipeResponsavel = res.json;
    });
  }

  /**
   * Método responsável por popular a lista de organizações.
  */
  popularListaOrganizacao() {
    this.organizacaoService.query().subscribe((res: ResponseWrapper) => {
      this.organizacoes = res.json;
    });
  }

  /**
   * Método responsável por popular a lista de manuais.
  */
  popularListaManual() {
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuais = res.json;
    });
  }

  private inicializaValoresAposCarregamento(analiseCarregada: Analise) {
    this.analise = analiseCarregada;
    this.organizacaoSelected(analiseCarregada.organizacao);
    this.carregarObjetos(analiseCarregada.contrato);
    this.carregaFatorAjusteNaEdicao();
  }

  organizacaoSelected(org: Organizacao) {
    this.contratos = org.contracts;
    this.sistemaService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
      this.sistemas = res.json;
    });
  }

  carregarObjetos(contrato: Contrato) {
    if (contrato && contrato.manual) {
      const manual: Manual = contrato.manual;
      this.carregarEsforcoFases(manual);
      this.carregarMetodosContagem(manual);
      this.inicializaFatoresAjuste(manual);
    }
  }

  contratoSelected(contrato: Contrato) {
    this.carregarObjetos(contrato);
    this.save();
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

  sistemaSelected() {
    this.analiseSharedDataService.sistemaSelecionado();
  }

  private carregaFatorAjusteNaEdicao() {
    const fatorAjuste: FatorAjuste = this.analise.fatorAjuste;
    if (fatorAjuste) {
      const fatorAjusteSelectItem: SelectItem
        = _.find(this.fatoresAjuste, { value: { id: fatorAjuste.id } });
      this.analise.fatorAjuste = fatorAjusteSelectItem.value;
    }
  }

  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  contratoDropdownPlaceholder() {
    if (this.contratos) {
      if (this.contratos.length > 0) {
        return 'Selecione um Contrato';
      } else {
        return 'Organização não possui nenhum Contrato cadastrado';
      }
    } else {
      return 'Selecione uma Organização';
    }
  }

  shouldEnableContratoDropdown() {
    return this.contratos && this.contratos.length > 0;
  }

  private carregarEsforcoFases(manual: Manual) {
    this.esforcoFases = _.cloneDeep(manual.esforcoFases);
    // Leandro pediu para trazer todos selecionados
    this.analise.esforcoFases = _.cloneDeep(manual.esforcoFases);
  }

  private carregarMetodosContagem(manual: Manual) {
    this.metodosContagem = [
      { value: 'DETALHADA',
        label: 'Detalhada (IFPUG)' },
      {
        value: 'INDICATIVA',
        label: this.getLabelValorVariacao('Indicativa (NESMA)', manual.valorVariacaoIndicativaFormatado)
      },
      {
        value: 'ESTIMADA',
        label: this.getLabelValorVariacao('Estimada (NESMA)', manual.valorVariacaoEstimadaFormatado)
      }
    ];
  }

  private getLabelValorVariacao(label: string, valorVariacao: number): string {
    return label + ' - ' + valorVariacao + '%';
  }

  totalEsforcoFases() {
    const initialValue = 0;
    return this.analise.esforcoFases.reduce((val, ef) => val + ef.esforcoFormatado, initialValue);
  }

  sistemaDropdownPlaceholder() {
    if (this.sistemas) {
      if (this.sistemas.length > 0) {
        return 'Selecione...';
      } else {
        return 'Organização não possui nenhum Sistema cadastrado';
      }
    } else {
      return 'Selecione uma Organização';
    }
  }

  shouldEnableSistemaDropdown() {
    return this.sistemas && this.sistemas.length > 0;
  }

  needContratoDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Selecione...';
    } else {
      return 'Selecione um Contrato';
    }
  }

  isContratoSelected(): boolean {
    return this.analiseSharedDataService.isContratoSelected();
  }

  fatoresAjusteDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Selecione um Fator de Ajuste';
    } else {
      return 'Selecione um Contrato para carregar os Fatores de Ajuste';
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  /**
   * Método responsável por persistir as informações das análises na edição.
   **/
  save() {
    this.analiseService.update(this.analise);
    // if (this.verificarCamposObrigatorios()) {
    // }

  }

  /**
   * Método responsável por validar campos obrigatórios na persistência.
   **/
  private verificarCamposObrigatorios(): boolean {
    if (!this.analise.identificadorAnalise) {
      this.pageNotificationService.addErrorMsg('Informe primeiro o campo Identificador da Analise para continuar.');
      return false;
    }
    if (this.analise.identificadorAnalise && !this.analise.metodoContagem) {
      this.pageNotificationService.addErrorMsg('Informe o Método de Contagem para continuar.');
      return false;
    }
    if (this.analise.identificadorAnalise && this.analise.metodoContagem && !this.analise.tipoAnalise) {
      this.pageNotificationService.addErrorMsg('Informe oTipo de Contagem para continuar.');
      return false;
    }
    return true;
  }

  public habilitarCamposIniciais() {
    return this.isEdicao;
  }

  public nomeSistema(): string {
    return this.analise.sistema.sigla + ' - ' + this.analise.sistema.nome;
  }

}
