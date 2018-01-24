import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ResponseWrapper, BaseEntity } from '../shared';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { Contrato, ContratoService } from '../contrato';
import { Sistema, SistemaService } from '../sistema';
import { SelectItem } from 'primeng/primeng';

import * as _ from 'lodash';
import { EsforcoFase } from '../esforco-fase/index';
import { FatorAjuste } from '../fator-ajuste/index';

@Component({
  selector: 'jhi-analise-form',
  templateUrl: './analise-form.component.html'
})
export class AnaliseFormComponent implements OnInit, OnDestroy {

  isSaving: boolean;
  analise: Analise;

  organizacoes: Organizacao[];
  contratos: Contrato[];
  sistemas: Sistema[];

  esforcoFases: EsforcoFase[] = [];

  metodosContagem: SelectItem[] = [];

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
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.organizacaoService.query().subscribe((res: ResponseWrapper) => {
      this.organizacoes = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.analise = new Analise();
      this.analise.esforcoFases = [];
      if (params['id']) {
        this.analiseService.find(params['id']).subscribe(analise => {
          this.analise = analise;
        });
      }
    });
  }

  organizacaoSelected(org: Organizacao) {
    this.contratos = org.contracts;
    this.sistemaService.findAllByOrganizacaoId(org.id).subscribe((res: ResponseWrapper) => {
      this.sistemas = res.json;
    });
  }

  contratoDropdownPlaceholder() {
    if (this.shouldEnableContratoDropdown()) {
      return 'Contrato';
    } else {
      return 'Contrato - Selecione uma Organização para carregar os Contratos';
    }
  }

  contratoSelected(contrato: Contrato) {
    const manual = contrato.manual;

    this.esforcoFases = _.cloneDeep(manual.esforcoFases);
    // Leandro pediu para trazer todos selecionados
    this.analise.esforcoFases = _.cloneDeep(manual.esforcoFases);

    this.metodosContagem = [
      { value: 'DETALHADA', label: 'DETALHADA' },
      { value: 'INDICATIVA', label: 'INDICATIVA - ' + (manual.valorVariacaoIndicativa * 100) + '%' },
      { value: 'ESTIMADA', label: 'ESTIMADA - ' + + (manual.valorVariacaoEstimada * 100) + '%' }
    ];

    this.fatoresAjuste = _.cloneDeep(manual.fatoresAjuste);
  }

  totalEsforcoFases() {
    const initialValue = 0;
    return this.analise.esforcoFases.reduce((val, ef) => val + ef.esforco, initialValue);
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
    if (this.shouldEnableTipoDeContagemDropdown()) {
      return 'Tipo de Contagem';
    } else {
      return 'Tipo de Contagem - Selecione um Contrato para carregar os Tipos de Contagem';
    }
  }

  shouldEnableTipoDeContagemDropdown() {
    // XXX mudar para um boolean do controller 'contratoSelecionado' ?
    return !_.isUndefined(this.analise.contrato);
  }

  fatoresAjusteDrodownPlaceholder() {
    if (this.shouldEnableTipoDeContagemDropdown()) {
      return 'Valor de Ajuste';
    } else {
      return 'Valor de Ajuste - Selecione um Contrato para carregar os Valores de Ajuste';
    }
  }

  shouldEnableFatoresAjusteDropdown() {
    // XXX mudar para um boolean do controller 'contratoSelecionado' ?
    return !_.isUndefined(this.analise.contrato);
  }

  showFatoresAjuste() {
    return JSON.stringify(this.fatoresAjuste);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  save() {

  }

}
