import { Component, Input, OnInit } from '@angular/core';
import { LinhaResumo } from '../analise-shared/resumo-funcoes';
import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './analise-shared-utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-analise-funcao-resumo-table',
  templateUrl: './funcao-resumo-table.component.html'
})
export class FuncaoResumoTableComponent implements OnInit {

  constructor(
    private translate: TranslateService
  ) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

  @Input()
  linhasResumo: LinhaResumo[];

  complexidades: string[];

  impactos: string[];

  ngOnInit() {
    this.complexidades = AnaliseSharedUtils.complexidades;
    this.impactos = AnaliseSharedUtils.impactos;
  }
  updateNameComplexidade(complexidade: string) {
    switch (complexidade) {
      case 'MEDIA':
        return this.getLabel('Analise.Analise.lstComplexidades.Media');
      case 'SEM':
        return this.getLabel('Analise.Analise.lstComplexidades.SEM');
      case 'ALTA':
        return this.getLabel('Analise.Analise.lstComplexidades.Alta');
      case 'INM':
        return this.getLabel('Analise.Analise.lstComplexidades.INM');
      case 'BAIXA':
        return this.getLabel('Analise.Analise.lstComplexidades.Baixa');
      default:
        break;
    }
  }

  updateNameImpacto(impacto: string) {
    switch (impacto) {
      case 'INCLUSAO':
        return this.getLabel('Analise.Analise.lstImpactos.Inclusao');
      case 'ALTERACAO':
        return this.getLabel('Analise.Analise.lstImpactos.Alteracao');
      case 'EXCLUSAO':
        return this.getLabel('Analise.Analise.lstImpactos.Exclusao');
      case 'CONVERSAO':
        return this.getLabel('Analise.Analise.lstImpactos.Conversao');
      default:
        break;

    }
  }

}
