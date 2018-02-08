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

  // TODO oferecer a opção 'Nenhum', com value vazio
  // campo opcional, caso o usuário escolha um sem querer, dever conseguir "abortar"
  // talvez tenha que ser no pipe
  fatoresAjuste: FatorAjuste[] = [];

  tiposAnalise: SelectItem[] = [
    { label: 'DESENVOLVIMENTO', value: 'DESENVOLVIMENTO' },
    { label: 'MELHORIA', value: 'MELHORIA' },
    { label: 'APLICACAO', value: 'APLICACAO' }
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
    const manual = contrato.manual;
    this.carregarEsforcoFases(manual);
    this.carregarMetodosContagem(manual);
    this.fatoresAjuste = _.cloneDeep(manual.fatoresAjuste);
  }

  sistemaSelected() {
    this.analiseSharedDataService.sistemaSelecionado();
  }

  private carregaFatorAjusteNaEdicao() {
    if (this.analise.fatorAjuste) {
      this.analise.fatorAjuste = _.find(this.fatoresAjuste, { 'id': this.analise.fatorAjuste.id });
    }
  }

  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  contratoDropdownPlaceholder() {
    if (this.shouldEnableContratoDropdown()) {
      return 'Contrato';
    } else {
      return 'Contrato - Selecione uma Organização para carregar os Contratos';
    }
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

  shouldEnableContratoDropdown() {
    return this.contratos && this.contratos.length > 0;
  }

  sistemaDropdownPlaceholder() {
    if (this.shouldEnableSistemaDropdown()) {
      return 'Sistema';
    } else {
      return 'Sistema - Selecione uma Organização para carregar os Sistemas';
    }
  }

  shouldEnableSistemaDropdown() {
    return this.sistemas && this.sistemas.length > 0;
  }

  tipoDeContagemDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Tipo de Contagem';
    } else {
      return 'Tipo de Contagem - Selecione um Contrato para carregar os Tipos de Contagem';
    }
  }

  isContratoSelected(): boolean {
    return this.analiseSharedDataService.isContratoSelected();
  }

  fatoresAjusteDropdownPlaceholder() {
    if (this.isContratoSelected()) {
      return 'Valor de Ajuste';
    } else {
      return 'Valor de Ajuste - Selecione um Contrato para carregar os Valores de Ajuste';
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  save() {

  }

}
