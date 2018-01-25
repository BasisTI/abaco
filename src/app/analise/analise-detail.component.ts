import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';

@Component({
  selector: 'jhi-analise-detail',
  templateUrl: './analise-detail.component.html'
  })
export class AnaliseDetailComponent implements OnInit, OnDestroy {

  analise: Analise;
  private subscription: Subscription;

  constructor(
    private analiseService: AnaliseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params) => {
      this.load(params['id']);
    });
  }

  load(id) {
    this.analiseService.find(id).subscribe((analise) => {
      this.analise = analise;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}