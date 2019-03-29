import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { FatorAjuste } from './fator-ajuste.model';
import { FatorAjusteService } from './fator-ajuste.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'jhi-fator-ajuste-detail',
  templateUrl: './fator-ajuste-detail.component.html'
})
export class FatorAjusteDetailComponent implements OnInit, OnDestroy {

  fatorAjuste: FatorAjuste;
  private subscription: Subscription;

  constructor(
    private fatorAjusteService: FatorAjusteService,
    private route: ActivatedRoute,
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
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.fatorAjusteService.find(id).subscribe((fatorAjuste) => {
      this.fatorAjuste = fatorAjuste;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
