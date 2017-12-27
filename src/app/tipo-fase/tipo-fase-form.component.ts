import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { TipoFase } from './tipo-fase.model';
import { TipoFaseService } from './tipo-fase.service';

@Component({
  selector: 'jhi-tipo-fase-form',
  templateUrl: './tipo-fase-form.component.html'
})
export class TipoFaseFormComponent implements OnInit, OnDestroy {
  tipoFase: TipoFase;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoFaseService: TipoFaseService,
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.tipoFase = new TipoFase();
      if (params['id']) {
        this.tipoFaseService.find(params['id']).subscribe(tipoFase => this.tipoFase = tipoFase);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.tipoFase.id !== undefined) {
      this.subscribeToSaveResponse(this.tipoFaseService.update(this.tipoFase));
    } else {
      this.subscribeToSaveResponse(this.tipoFaseService.create(this.tipoFase));
    }
  }

  private subscribeToSaveResponse(result: Observable<TipoFase>) {
    result.subscribe((res: TipoFase) => {
      this.isSaving = false;
      this.router.navigate(['/tipoFase']);
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
