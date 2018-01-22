import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

import { Analise } from './analise.model';
import { AnaliseService } from './analise.service';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-analise-form',
  templateUrl: './analise-form.component.html'
})
export class AnaliseFormComponent implements OnInit, OnDestroy {

  isSaving: boolean;
  analise: Analise;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private analiseService: AnaliseService,
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.analise = new Analise();
      if (params['id']) {
        this.analiseService.find(params['id']).subscribe(analise => {
          this.analise = analise;
        });
      }
    });
  }

  

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
