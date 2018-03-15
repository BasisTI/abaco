import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ResponseWrapper, BaseEntity, AnaliseSharedDataService } from '../shared';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { Contrato, ContratoService } from '../contrato';
import { Sistema, SistemaService } from '../sistema';
import { SelectItem } from 'primeng/primeng';

import * as _ from 'lodash';
import { EsforcoFase } from '../esforco-fase/index';
import { FatorAjuste } from '../fator-ajuste/index';
import { Manual } from '../manual/index';
import { FatorAjusteLabelGenerator } from '../shared/fator-ajuste-label-generator';

@Component({
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
  private fatorAjusteNenhumSelectItem = { label: 'Nenhum', value: undefined };

    /** 
   * Método responsável por popular a combo de tipo de analise.
  */
  tiposAnalise: SelectItem[] = [
    { label: 'DESENVOLVIMENTO', value: 'DESENVOLVIMENTO' },
    { label: 'MELHORIA', value: 'MELHORIA' },
    { label: 'APLICACAO', value: 'APLICACAO' }
  ];

  /** 
   * Método responsável por popular a combo de tipo de contagem.
  */
  tipoContagem: SelectItem[] = [
    {label: 'Projeto de Desenvolvimento', value: 'Projeto de Desenvolvimento'},
    {label: 'Projeto Melhoria', value: 'Projeto Melhoria'},
    {label: 'Contagem de Aplicação (Baseline)', value: 'Contagem de Aplicação (Baseline)'}
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
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.organizacaoService.query().subscribe((res: ResponseWrapper) => {
      this.organizacoes = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.analise = new Analise();
      if (params['id']) {
        this.isEdicao = true;
        this.analiseService.find(params['id']).subscribe(analise => {
          this.inicializaValoresAposCarregamento(analise);
          this.analiseSharedDataService.analiseCarregada();
        });
      } else {
        this.isEdicao = false;
        this.analise.esforcoFases = [];
      }
    });
  }

  private inicializaValoresAposCarregamento(analiseCarregada: Analise) {
    this.analise = analiseCarregada;
    // TODO organizacao.copyFromJSON() convertendo sistemas => não precisa da requisicao
    this.organizacaoSelected(analiseCarregada.organizacao);
    this.contratoSelected(analiseCarregada.contrato);
    this.carregaFatorAjusteNaEdicao();
  }

  organizacaoSelected(org: Organizacao) {
    this.contratos = org.contracts;
    this.sistemaService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
      this.sistemas = res.json;
    });
  }

  contratoSelected(contrato: Contrato) {
    const manual: Manual = contrato.manual;
    this.carregarEsforcoFases(manual);
    this.carregarMetodosContagem(manual);
    this.inicializaFatoresAjuste(manual);
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
      return 'Selecione uma Organização para carregar os Contratos';
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
      { value: 'DETALHADA', label: 'DETALHADA' },
      {
        value: 'INDICATIVA',
        label: this.getLabelValorVariacao('INDICATIVA', manual.valorVariacaoIndicativaFormatado)
      },
      {
        value: 'ESTIMADA',
        label: this.getLabelValorVariacao('ESTIMADA', manual.valorVariacaoEstimadaFormatado)
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
        return 'Selecione um Sistema';
      } else {
        return 'Organização não possui nenhum Sistema cadastrado';
      }
    } else {
      return 'Selecione uma Organização para carregar os Sistemas';
    }
  }

  shouldEnableSistemaDropdown() {
    return this.sistemas && this.sistemas.length > 0;
  }

  tipoDeContagemDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Selecione um Tipo de Contagem';
    } else {
      return 'Selecione um Contrato para carregar os Tipos de Contagem';
    }
  }

  metodoContagemDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Selecione um Método de Contagem';
    } else {
      return 'Selecione um Contrato para carregar os Métodos de Contagem';
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

  save() {

  }

}
