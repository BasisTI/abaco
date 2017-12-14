import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { Alr } from './alr.model';
import { AlrService } from './alr.service';
import { FuncaoTransacao, FuncaoTransacaoService } from '../funcao-transacao';
import { ResponseWrapper } from '../shared';

@Component({
  selector: 'jhi-alr-form',
  templateUrl: './alr-form.component.html'
})
export class AlrFormComponent implements OnInit, OnDestroy {

  funcaotransacaos: FuncaoTransacao[];
  alr: Alr;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alrService: AlrService,
    private funcaoTransacaoService: FuncaoTransacaoService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.funcaoTransacaoService.query().subscribe((res: ResponseWrapper) => {
      this.funcaotransacaos = res.json;
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.alr = new Alr();
      if (params['id']) {
        this.alrService.find(params['id']).subscribe(alr => this.alr = alr);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.alr.id !== undefined) {
      this.subscribeToSaveResponse(this.alrService.update(this.alr));
    } else {
      this.subscribeToSaveResponse(this.alrService.create(this.alr));
    }
  }

  private subscribeToSaveResponse(result: Observable<Alr>) {
    result.subscribe((res: Alr) => {
      this.isSaving = false;
      this.router.navigate(['/alr']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
