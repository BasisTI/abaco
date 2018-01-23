import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { TipoEquipe } from './tipo-equipe.model';
import { TipoEquipeService } from './tipo-equipe.service';

import { PageNotificationService } from '../shared';

@Component({
  selector: 'jhi-tipo-equipe-form',
  templateUrl: './tipo-equipe-form.component.html'
})
export class TipoEquipeFormComponent implements OnInit, OnDestroy {
  tipoEquipe: TipoEquipe;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoEquipeService: TipoEquipeService,
    private pageNotificationService: PageNotificationService,
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.tipoEquipe = new TipoEquipe();
      if (params['id']) {
        this.tipoEquipeService.find(params['id']).subscribe(tipoEquipe => this.tipoEquipe = tipoEquipe);
      }
    });
  }

  save() {
    this.isSaving = true;
    if (this.tipoEquipe.id !== undefined) {
      this.subscribeToSaveResponse(this.tipoEquipeService.update(this.tipoEquipe));
      this.pageNotificationService.addUpdateMsg();
    } else {
      this.subscribeToSaveResponse(this.tipoEquipeService.create(this.tipoEquipe));
    }
  }

  private subscribeToSaveResponse(result: Observable<TipoEquipe>) {
    result.subscribe((res: TipoEquipe) => {
      this.isSaving = false;
      this.router.navigate(['/admin/tipoEquipe']);
      this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;
      switch(error.status) {
        case 400: {
          let invalidFieldNamesString = "";
          const fieldErrors = JSON.parse(error["_body"]).fieldErrors;
          invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
          this.pageNotificationService.addErrorMsg("Campos inválidos: " + invalidFieldNamesString);
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
