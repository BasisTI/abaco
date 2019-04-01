import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Sistema } from './sistema.model';
import { SistemaService } from './sistema.service';

@Component({
  selector: 'jhi-sistema-detail',
  templateUrl: './sistema-detail.component.html'
})
export class SistemaDetailComponent implements OnInit, OnDestroy {

  sistema: Sistema;
  private subscription: Subscription;

  constructor(
    private sistemaService: SistemaService,
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
    this.sistemaService.find(id).subscribe((sistema) => {
      this.sistema = sistema;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
