import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
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

  analiseCarregada = false;

  resumoTotal: ResumoTotal;

  complexidades: string[];

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
    private changeDectetorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.complexidades = AnaliseSharedUtils.complexidades;
    this.analiseSharedDataService.getLoadSubject().subscribe(() => {
      this.analiseCarregada = true;
      this.resumoTotal = this.analiseSharedDataService.analise.resumoTotal;
      this.changeDectetorRef.detectChanges();
    });
  }

  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

}
