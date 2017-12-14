import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Contrato } from './contrato.model';
import { ContratoService } from './contrato.service';
import { Manual, ManualService } from '../manual';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-contrato-form',
  templateUrl: './contrato-form.component.html'
})
export class ContratoFormComponent implements OnInit, OnDestroy {

  manuals: Manual[];
  contrato: Contrato;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contratoService: ContratoService,
    private manualService: ManualService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.manualService.query().subscribe((res: ResponseWrapper) => {
      this.manuals = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.contrato = new Contrato();
      if (params['id']) {
        this.contratoService.find(params['id']).subscribe(contrato => this.contrato = contrato);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.contrato.id !== undefined) {
      this.subscribeToSaveResponse(this.contratoService.update(this.contrato));
    } else {
      this.subscribeToSaveResponse(this.contratoService.create(this.contrato));
    }
  }

  private subscribeToSaveResponse(result: Observable<Contrato>) {
    result.subscribe((res: Contrato) => {
      this.isSaving = false;
      this.router.navigate(['/contrato']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
