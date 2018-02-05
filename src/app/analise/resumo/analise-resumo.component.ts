import { Component, Input, OnInit } from '@angular/core';
import { ResumoFuncoes, ResumoTotal } from '../../analise-shared/resumo-funcoes';
import { Complexidade } from '../../analise-shared/complexidade-enum';
import { AnaliseSharedUtils } from '../../analise-shared/analise-shared-utils';
import { AnaliseSharedDataService } from '../../shared';
import { Analise } from '../analise.model';

@Component({
  selector: 'app-analise-resumo',
  templateUrl: './analise-resumo.component.html'
})
export class AnaliseResumoComponent implements OnInit {

  resumoTotal: ResumoTotal;

  complexidades: string[];

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService
  ) { }

  ngOnInit() {
    this.complexidades = AnaliseSharedUtils.complexidades;
    this.resumoTotal = this.analiseSharedDataService.analise.resumoTotal;
  }

  get analiseCarregada(): boolean {
    return this.analiseSharedDataService.analiseCarregada;
  }

  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

}
