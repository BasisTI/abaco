import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { TipoEquipe } from './tipo-equipe.model';
import { TipoEquipeService } from './tipo-equipe.service';

import { PageNotificationService } from '../shared';
import { Organizacao, OrganizacaoService } from '../organizacao';

@Component({
  selector: 'jhi-tipo-equipe-form',
  templateUrl: './tipo-equipe-form.component.html'
})

export class TipoEquipeFormComponent implements OnInit, OnDestroy {

  tipoEquipe: TipoEquipe;

  isSaving: boolean;

  private routeSub: Subscription;

  organizacoes: Organizacao[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoEquipeService: TipoEquipeService,
    private pageNotificationService: PageNotificationService,
    private organizacaoService: OrganizacaoService,
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.routeSub = this.route.params.subscribe(params => {
      this.tipoEquipe = new TipoEquipe();
      if (params['id']) {
        this.tipoEquipeService.find(params['id']).subscribe(tipoEquipe => this.tipoEquipe = tipoEquipe);
      }
    });
    this.organizacaoService.findActiveOrganizations().subscribe((res) => {
      this.organizacoes = res;
    });
  }

  save() {
    this.isSaving = true;
    let teamTypesRegistered: Array<TipoEquipe>;
    this.tipoEquipeService.query().subscribe(response => {
        teamTypesRegistered = response.json;
        if (this.tipoEquipe.id !== undefined) {
          if (this.checkRequiredFields() && this.checkFieldsMaxLength() && !this.checkDuplicity(teamTypesRegistered)) {
            this.subscribeToSaveResponse(this.tipoEquipeService.update(this.tipoEquipe));
          }
        } else {
          if (this.checkRequiredFields() && this.checkFieldsMaxLength() && !this.checkDuplicity(teamTypesRegistered)) {
            this.subscribeToSaveResponse(this.tipoEquipeService.create(this.tipoEquipe));
          }
        }
    });
  }

  private checkDuplicity(teamTypes: Array<TipoEquipe>) {
    let isAlreadyRegistered = false;

    teamTypes.forEach(each => {
      if (this.tipoEquipe.nome === each.nome && this.tipoEquipe.id !== each.id) {
        isAlreadyRegistered = true;
        this.pageNotificationService.addErrorMsg('Registro já cadastrado!');
      }
    });

    return isAlreadyRegistered;
  }

  private resetMarkFields() {
    document.getElementById('nome_tipo_equipe').setAttribute('style', 'border-color: #bdbdbd');
  }

  private checkRequiredFields(): boolean {
    let isValid = false;
    this.resetMarkFields();
    if (this.tipoEquipe.nome !== undefined && this.tipoEquipe.nome !== null && this.tipoEquipe.nome !== '' && this.tipoEquipe.nome !== ' ') {
      isValid = true;
    } else {
      this.pageNotificationService.addErrorMsg('Favor preencher os campos obrigatórios!');
      document.getElementById('nome_tipo_equipe').setAttribute('style', 'border-color: red');
    }

    return isValid;
  }

  private checkFieldsMaxLength() {
    let isValid = false;

    if (this.tipoEquipe.nome.length < 255) {
      isValid = true;
    } else {
      this.pageNotificationService.addErrorMsg('O campo nome excede o número de caracteres permitidos.');
    }

    return isValid;
  }

  private subscribeToSaveResponse(result: Observable<TipoEquipe>) {
    result.subscribe((res: TipoEquipe) => {
      this.isSaving = false;
      this.router.navigate(['/admin/tipoEquipe']);
      (this.tipoEquipe.id === null) ? (this.pageNotificationService.addCreateMsg()) : (this.pageNotificationService.addUpdateMsg())

    }, (error: Response) => {
      this.isSaving = false;
      switch (error.status) {
        case 400: {
          let invalidFieldNamesString = '';
          const fieldErrors = JSON.parse(error['_body']).fieldErrors;
          invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
          this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldNamesString);
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
