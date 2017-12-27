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
    private route: ActivatedRoute
  ) {}

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
