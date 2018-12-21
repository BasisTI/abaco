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
    this.impactos = AnaliseSharedUtils.impactos;
  }
  updateNameComplexidade(complexidade: string) {
    switch(complexidade) {
      case 'MEDIA':
        return 'MÉDIA';
      case 'SEM':
        return 'SEM';
      case 'ALTA':
        return 'ALTA';
      case 'INM':
        return 'INM';
      case 'BAIXA':
        return 'BAIXA';
      break;
      }
  }

  updateNameImpacto(impacto: string) {
    switch(impacto) {
      case 'INCLUSAO':
        return 'INCLUSÃO';
      case 'ALTERACAO':
        return 'ALTERAÇÃO';
      case 'EXCLUSAO':
        return 'EXCLUSÃO';
      case 'CONVERSAO' :
        return 'CONVERSÃO';
      break;
      }
  }

}
