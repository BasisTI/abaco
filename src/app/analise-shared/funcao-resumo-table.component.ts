import { Component, Input, OnInit } from '@angular/core';
import { ResumoGrupoLogico } from '../analise-shared/resumo-funcoes';
import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './index';

@Component({
    selector: 'app-analise-funcao-resumo-table',
    templateUrl: './funcao-resumo-table.component.html'
  })
export class FuncaoResumoTableComponent implements OnInit {

  @Input()
  resumosGrupoLogico: ResumoGrupoLogico[];

  complexidades: string[];

  ngOnInit() {
    this.complexidades = AnaliseSharedUtils.complexidades;
  }

}
