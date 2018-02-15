import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { TipoFase } from './tipo-fase.model';
import { TipoFaseService } from './tipo-fase.service';

import { PageNotificationService } from '../shared';

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
    private pageNotificationService: PageNotificationService,
  ) { }

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
    this.tipoFaseService.query().subscribe(response => {
      let allPhases = response;

      if(this.checkPhaseNameIsValid()) {
        if(!this.checkIfPhaseAlreadyExist(allPhases.json)) {
          this.isSaving = true;
          if(this.tipoFase.id !== undefined) {
            this.subscribeToSaveResponse(this.tipoFaseService.update(this.tipoFase));
          } else {
            this.subscribeToSaveResponse(this.tipoFaseService.create(this.tipoFase));
          }
        }
      }
    });
  }

  private checkIfPhaseAlreadyExist(registeredPhases: Array<TipoFase>): boolean {
    let isAlreadyRegistered: boolean = false;
    registeredPhases.forEach(each => {
      if (each.nome.toUpperCase() === this.tipoFase.nome.toUpperCase() && each.id !== this.tipoFase.id) {
        isAlreadyRegistered = true;
        this.pageNotificationService.addErrorMsg('Já existe uma fase com este nome!');
      }
    });
    return isAlreadyRegistered;
  }

  private checkPhaseNameIsValid(): boolean {
    let isNameValid: boolean = false;

    document.getElementById('nome_fase').setAttribute('style', 'border-color: #bdbdbd');
    if (this.tipoFase.nome !== null && this.tipoFase.nome !== undefined && this.tipoFase.nome !== "") {
      isNameValid = true;
      console.log(this.tipoFase.nome.length);
      if (this.tipoFase.nome.length > 254) {
        this.pageNotificationService.addErrorMsg('O nome da fase excede o máximo de caracteres!');
        isNameValid = false;
      }
    } else {
      this.pageNotificationService.addErrorMsg('Favor, informar os campos obrigatórios!');
      document.getElementById('nome_fase').setAttribute('style', 'border-color: red');
    }

    return isNameValid;
  }

  private subscribeToSaveResponse(result: Observable<TipoFase>) {
    result.subscribe((res: TipoFase) => {
      this.isSaving = false;
      this.router.navigate(['/tipoFase']);
      this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;

      switch (error.status) {
        case 400: {
          const fieldErrors = JSON.parse(error["_body"]).fieldErrors;

          let invalidFieldsString = this.pageNotificationService.getInvalidFields(fieldErrors);

          this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldsString);
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
