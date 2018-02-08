import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ResumoFuncoes, ResumoTotal } from '../../analise-shared/resumo-funcoes';
import { Complexidade } from '../../analise-shared/complexidade-enum';
import { AnaliseSharedUtils } from '../../analise-shared/analise-shared-utils';
import { AnaliseSharedDataService } from '../../shared';
import { Analise } from '../analise.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-analise-resumo',
  templateUrl: './analise-resumo.component.html'
})
export class AnaliseResumoComponent implements OnInit, OnDestroy {

  resumoTotal: ResumoTotal;

  complexidades: string[];

  private analiseCarregadaSubscription: Subscription;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.complexidades = AnaliseSharedUtils.complexidades;
    this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
      this.resumoTotal = this.analiseSharedDataService.analise.resumoTotal;
      this.changeDetectorRef.detectChanges();
    });
  }

  get analise(): Analise {
    return this.analiseSharedDataService.analise;
  }

  ngOnDestroy() {
    this.changeDetectorRef.detach();
    this.analiseCarregadaSubscription.unsubscribe();
  }

}
