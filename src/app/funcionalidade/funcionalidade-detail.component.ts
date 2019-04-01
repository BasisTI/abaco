import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Funcionalidade } from './funcionalidade.model';
import { FuncionalidadeService } from './funcionalidade.service';

@Component({
  selector: 'jhi-funcionalidade-detail',
  templateUrl: './funcionalidade-detail.component.html'
})
export class FuncionalidadeDetailComponent implements OnInit, OnDestroy {

  funcionalidade: Funcionalidade;
  modulos: Array<any>;
  private subscription: Subscription;

  constructor(
    private funcionalidadeService: FuncionalidadeService,
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
    this.funcionalidadeService.find(id).subscribe((funcionalidade) => {
      this.funcionalidade = funcionalidade;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
