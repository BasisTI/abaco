import { Component, OnInit, Input } from '@angular/core';
import { FuncaoDados } from './funcao-dados.model';
import { Analise } from '../analise';
import { Manual } from '../manual';
import { FatorAjuste } from '../fator-ajuste';
import { AnaliseSharedDataService } from '../shared';


@Component({
  selector: 'app-analise-funcao-dados',
  templateUrl: './funcao-dados-form.component.html'
})
export class FuncaoDadosFormComponent implements OnInit {

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService
  ) { }

  fatoresAjuste: FatorAjuste[];

  funcaoDados: FuncaoDados = new FuncaoDados();
  private manual: Manual;

  ngOnInit() {
    
  }

  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  set analise(analise: Analise) {
    this.analiseSharedDataService.analise = analise;
  }


}
