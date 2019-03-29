import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Modulo } from './modulo.model';
import { ModuloService } from './modulo.service';

@Component({
  selector: 'jhi-modulo-detail',
  templateUrl: './modulo-detail.component.html'
})
export class ModuloDetailComponent implements OnInit, OnDestroy {

  modulo: Modulo;
  private subscription: Subscription;

  constructor(
    private moduloService: ModuloService,
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
    this.moduloService.find(id).subscribe((modulo) => {
      this.modulo = modulo;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
