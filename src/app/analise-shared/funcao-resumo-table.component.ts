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
        return 'MÉD';
      case 'SEM':
        return 'SEM';
      case 'ALTA':
        return 'ALT';
      case 'INM':
        return 'INM';
      case 'BAIXA':
        return 'BAI';
      default:
        break;
      }
  }

  updateNameImpacto(impacto: string) {
    switch(impacto) {
      case 'INCLUSAO':
        return 'INCL';
      case 'ALTERACAO':
        return 'ALTE';
      case 'EXCLUSAO':
        return 'EXCL';
      case 'CONVERSAO' :
        return 'CONV';
      default:
        break;

      }
  }

}
