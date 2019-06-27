import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';

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
    private translate: TranslateService
  ) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

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

  save(form) {

    if (!form.valid) {
      this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.FavorPreencherCamposObrigatorios'));
      return;
    }

    this.isSaving = true;
    let teamTypesRegistered: Array<TipoEquipe>;
    this.tipoEquipeService.dropDown().subscribe(response => {
      teamTypesRegistered = response.json;
      if (this.tipoEquipe.id !== undefined) {
        if (this.checkFieldsMaxLength() && !this.checkDuplicity(teamTypesRegistered)) {
          this.subscribeToSaveResponse(this.tipoEquipeService.update(this.tipoEquipe));
        }
      } else {
        if (this.checkFieldsMaxLength() && !this.checkDuplicity(teamTypesRegistered)) {
          this.subscribeToSaveResponse(this.tipoEquipeService.create(this.tipoEquipe));
        }
      }
    });
  }

  private checkDuplicity(teamTypes: Array<TipoEquipe>) {
    let isAlreadyRegistered = false;

    if (teamTypes) {
      teamTypes.forEach(each => {
        if (this.tipoEquipe.nome === each.nome && this.tipoEquipe.id !== each.id) {
          isAlreadyRegistered = true;
          this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.TipoEquipe.Mensagens.msgExisteTipoEquipeRegistradoComEsteNome'));
        }
      });
    }

    return isAlreadyRegistered;
  }

  private resetMarkFields() {
    document.getElementById('nome_tipo_equipe').setAttribute('style', 'border-color: #bdbdbd');
    document.getElementById('org_tipo_equipe').setAttribute('style', 'border-color: #bdbdbd');
  }

  private checkFieldsMaxLength() {
    let isValid = false;

    if (this.tipoEquipe.nome.length < 255) {
      isValid = true;
    } else {
      this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.TipoEquipe.Mensagens.msgCampoNomeExcedeNumeroCaracteresPermitidos'));
    }

    return isValid;
  }

  private subscribeToSaveResponse(result: Observable<TipoEquipe>) {
    result.subscribe((res: TipoEquipe) => {
      this.isSaving = false;
      this.router.navigate(['/admin/tipoEquipe']);
      (this.tipoEquipe.id == null) ? (this.pageNotificationService.addCreateMsg()) : (this.pageNotificationService.addUpdateMsg());

    }, (error: Response) => {
      this.isSaving = false;
      switch (error.status) {
        case 400: {
          let invalidFieldNamesString = '';
          const fieldErrors = JSON.parse(error['_body']).fieldErrors;
          invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
          this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.TipoEquipe.Mensagens.msgCamposInvalidos') + invalidFieldNamesString);
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  public informarNome(): string {
    if (!this.tipoEquipe.nome) {
      return this.getLabel('Cadastros.TipoEquipe.Mensagens.msgCampoObrigatorio');
    }
  }

  public informarOrganizacao(): string {
    if (!this.tipoEquipe.organizacoes) {
      return this.getLabel('Cadastros.TipoEquipe.Mensagens.msgCampoObrigatorio');
    }
  }

}
