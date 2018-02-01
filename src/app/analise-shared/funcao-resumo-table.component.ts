import { Component, Input, OnInit } from '@angular/core';
import { ResumoFuncoes } from '../analise-shared/resumo-funcoes';
import { Complexidade } from './complexidade-enum';

@Component({
    selector: 'app-analise-funcao-resumo-table',
    templateUrl: './funcao-resumo-table.component.html'
  })
export class FuncaoResumoTableComponent implements OnInit {

  @Input()
  resumoFuncoes: ResumoFuncoes;

  complexidades: string[];

  ngOnInit() {
    this.complexidades = Object.keys(Complexidade).map(k => Complexidade[k as any]);
  }

}
