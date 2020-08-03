import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Contrato } from '../contrato.model';
import { ContratoService } from '../contrato.service';

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
  ) {}

  getLabel(label) {
    let str: any;
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
