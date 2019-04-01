import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ResumoFuncoes, ResumoTotal } from '../../analise-shared/resumo-funcoes';
import { Complexidade } from '../../analise-shared/complexidade-enum';
import { AnaliseSharedUtils } from '../../analise-shared/analise-shared-utils';
import { AnaliseSharedDataService } from '../../shared';
import { Analise } from '../analise.model';
import { Subscription } from 'rxjs/Subscription';
import { EsforcoFase } from '../../esforco-fase';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-analise-resumo',
  templateUrl: './analise-resumo.component.html'
})
export class AnaliseResumoComponent implements OnInit, OnDestroy {

  resumoTotal: ResumoTotal;

  complexidades: string[];

  esforcoFases: EsforcoFase[];

  private analiseCarregadaSubscription: Subscription;

  constructor(
    private analiseSharedDataService: AnaliseSharedDataService,
    private changeDetectorRef: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
        str = res;
    }).unsubscribe();
    return str;
  }

  ngOnInit() {
    this.complexidades = AnaliseSharedUtils.complexidades;
    this.analiseCarregadaSubscription = this.analiseSharedDataService.getLoadSubject().subscribe(() => {
      this.resumoTotal = this.analiseSharedDataService.analise.resumoTotal;
      this.esforcoFases = this.analiseSharedDataService.analise.esforcoFases;
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
