import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Contrato } from './contrato.model';
import { ContratoService } from './contrato.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-contrato-detail',
  templateUrl: './contrato-detail.component.html'
})
export class ContratoDetailComponent implements OnInit, OnDestroy {

  contrato: Contrato;
  private subscription: Subscription;

  constructor(
    private contratoService: ContratoService,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
        str = res;
    }).unsubscribe();
    return str;
  }
  

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.contratoService.find(id).subscribe((contrato) => {
      this.contrato = contrato;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
