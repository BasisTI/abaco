import { Component, Input, OnInit } from '@angular/core';
import { LinhaResumo } from '../analise-shared/resumo-funcoes';
import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './analise-shared-utils';

@Component({
    selector: 'app-analise-funcao-resumo-table',
    templateUrl: './funcao-resumo-table.component.html'
  })
export class FuncaoResumoTableComponent implements OnInit {

  @Input()
  linhasResumo: LinhaResumo[];

  complexidades: string[];

  impactos: string[];

  ngOnInit() {
    this.complexidades = AnaliseSharedUtils.complexidades;
  }

}
