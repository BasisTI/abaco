import { Component, OnInit, Input } from '@angular/core';
import { AnaliseSharedDataService } from '../shared';
import { FuncaoDados } from './funcao-dados.model';
import { Analise } from '../analise';
import { FatorAjuste } from '../fator-ajuste';

import * as _ from 'lodash';
import { Modulo } from '../modulo/index';
import { Funcionalidade } from '../funcionalidade/index';

@Component({
  selector: 'app-analise-funcao-dados',
  templateUrl: './funcao-dados-form.component.html'
})
export class FuncaoDadosFormComponent implements OnInit {

  funcoesDados: FuncaoDados[];
  currentFuncaoDados: FuncaoDados;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
  ) { }

  ngOnInit() {
    this.funcoesDados = [];
    this.currentFuncaoDados = new FuncaoDados();
  }

  private get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  private set analise(analise: Analise) {
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

  moduloSelected(modulo: Modulo) {

  }

  funcionalidadeSelected(funcionalidade: Funcionalidade) {
    this.currentFuncaoDados.funcionalidade = funcionalidade;
  }

  adicionar() {
    this.analise.addFuncaoDados(this.currentFuncaoDados);
    // Mantendo o mesmo conteudo a pedido do Leandro
    this.currentFuncaoDados = this.currentFuncaoDados.clone();
    this.currentFuncaoDados.artificialId = undefined;
  }
}
