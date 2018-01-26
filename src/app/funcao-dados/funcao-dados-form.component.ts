import { Component, OnInit, Input } from '@angular/core';
import { FuncaoDados } from './funcao-dados.model';
import { Analise } from '../analise';
import { Manual } from '../manual';
import { FatorAjuste } from '../fator-ajuste';


@Component({
  selector: 'app-analise-funcao-dados',
  templateUrl: './funcao-dados-form.component.html'
})
export class FuncaoDadosFormComponent implements OnInit {

  @Input()
  analise: Analise;

  fatoresAjuste: FatorAjuste[];

  funcaoDados: FuncaoDados = new FuncaoDados();
  private manual: Manual;

  ngOnInit() {
    this.manual = this.analise.contrato.manual;
    this.fatoresAjuste = this.manual.fatoresAjuste;
  }




}
