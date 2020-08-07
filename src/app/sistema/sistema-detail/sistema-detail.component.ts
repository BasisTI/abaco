import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Sistema } from '../sistema.model';
import { SistemaService } from '../sistema.service';
import { Subscription } from 'rxjs';

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
  ) { }

  getLabel(label) {
    return label;
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.sistemaService.find(id).subscribe((sistema) => {
      this.sistema = Sistema.fromJSON(sistema)
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
