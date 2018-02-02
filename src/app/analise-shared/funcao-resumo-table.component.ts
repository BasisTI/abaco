import { Component, Input, OnInit } from '@angular/core';
import { ResumoFuncoes } from '../analise-shared/resumo-funcoes';
import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './index';

@Component({
    selector: 'app-analise-funcao-resumo-table',
    templateUrl: './funcao-resumo-table.component.html'
  })
export class FuncaoResumoTableComponent implements OnInit {

  @Input()
  resumoFuncoes: ResumoFuncoes;

  complexidades: string[];

  ngOnInit() {
    this.complexidades = AnaliseSharedUtils.complexidades;
  }

}
