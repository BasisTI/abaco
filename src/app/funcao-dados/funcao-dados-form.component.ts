import { Component, OnInit, Input } from '@angular/core';
import { AnaliseSharedDataService } from '../shared';
import { FuncaoDados } from './funcao-dados.model';
import { Analise } from '../analise';
import { Manual } from '../manual';
import { FatorAjuste } from '../fator-ajuste';
import { Modulo } from '../modulo';
import { Funcionalidade } from '../funcionalidade';

import * as _ from 'lodash';
import { Sistema } from '../sistema/index';

@Component({
  selector: 'app-analise-funcao-dados',
  templateUrl: './funcao-dados-form.component.html'
})
export class FuncaoDadosFormComponent implements OnInit {

  funcoesDados: FuncaoDados[];
  currentFuncaoDados: FuncaoDados;

  mostrarDialogModulo = false;
  novoModulo: Modulo = new Modulo();
  moduloSelecionado: Modulo;

  funcionalidades: Funcionalidade[];
  mostrarDialogFuncionalidade = false;
  novaFuncionalidade: Funcionalidade = new Funcionalidade();
  funcionalidadeSelecionada: Funcionalidade;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService
  ) { }

  ngOnInit() {
    this.funcoesDados = [];
    this.currentFuncaoDados = new FuncaoDados();
  }

  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }

  private get manual() {
    if (this.analiseSharedDataService.analise.contrato) {
      return this.analiseSharedDataService.analise.contrato.manual;
    }
    return undefined;
  }

  get fatoresAjuste(): FatorAjuste[] {
    if (this.manual) {
      return _.cloneDeep(this.manual.fatoresAjuste);
    }
    return [];
  }

  get sistema(): Sistema {
    return this.analise.sistema;
  }

  get modulos() {
    if (this.sistema) {
      return this.sistema.modulos;
    }
  }

  abrirDialogModulo() {
    this.mostrarDialogModulo = true;
    // XXX problema em dar new toda hora?
    this.novoModulo = new Modulo();
  }

  fecharDialogModulo() {
    this.mostrarDialogModulo = false;
  }

  abrirDialogFuncionalidade() {
    this.mostrarDialogFuncionalidade = true;
    this.novaFuncionalidade = new Funcionalidade();
  }

  fecharDialogFuncionalidade() {
    this.mostrarDialogFuncionalidade = false;
  }

  moduloSelected(modulo: Modulo) {
    this.funcionalidades = modulo.funcionalidades;
  }

}
