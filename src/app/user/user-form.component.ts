import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { SelectItem } from 'primeng/primeng';

import { User } from './user.model';
import { UserService } from './user.service';
import { TipoEquipe, TipoEquipeService } from '../tipo-equipe';
import { Organizacao, OrganizacaoService } from '../organizacao';
import { ResponseWrapper } from '../shared';
import { Authority } from './authority.model';
import { PageNotificationService } from '../shared/page-notification.service';

import * as _ from 'lodash';

@Component({
  selector: 'jhi-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit, OnDestroy {

  tipoEquipes: TipoEquipe[];
  organizacoes: Organizacao[];
  authorities: Authority[];
  user: User;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private tipoEquipeService: TipoEquipeService,
    private organizacaoService: OrganizacaoService,
    private pageNotificationService: PageNotificationService
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.tipoEquipeService.query().subscribe((res: ResponseWrapper) => {
      this.tipoEquipes = res.json;
    });
    this.organizacaoService.findActiveOrganizations().subscribe((res) => {
      this.organizacoes = res;
    });
    this.userService.authorities().subscribe((res: Authority[]) => {
      this.authorities = res;
      this.populateAuthoritiesArtificialIds();
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.user = new User();
      if (params['id']) {
        this.userService.find(params['id']).subscribe(user => {
          this.user = user;
          this.populateUserAuthoritiesWithArtificialId();
        });
      }
    });
  }

  // FIXME parte da solução rápida e ruim, porém dinâmica
  // Horrível para muitas permissões
  private populateAuthoritiesArtificialIds() {
    this.authorities.forEach((authority, index) => {
      authority.artificialId = index;
    });
  }

  // FIXME Solução rápida e ruim. O(n^2) no pior caso
  // Funciona para qualquer autoridade que vier no banco
  // // Em oposição a uma solução mais simples porém hardcoded.
  private populateUserAuthoritiesWithArtificialId() {
    this.user.authorities.forEach(authority => {
      this.authorities.forEach(userAuthority => {
        if (authority.name === userAuthority.name) {
          userAuthority.artificialId = authority.artificialId;
        }
      });
    });
  }

  save() {
    this.isSaving = true;
    if (this.user.id !== undefined) {
      (this.isUsernamesValid()) ? (this.subscribeToSaveResponse(this.userService.update(this.user))) : (this)
    } else {
      (this.isUsernamesValid()) ? (this.subscribeToSaveResponse(this.userService.create(this.user))) : (this)
    }
  }

  private isUsernamesValid(): boolean {
    let isValid = false;
    this.returnInputToNormalStyle();
    let isFirstNameValid = false;
    let isLastNameValid = false;
    let isLoginValid = false;

    if(this.user.firstName !== undefined && this.user.firstName !== null && this.user.firstName !== '') {
      isFirstNameValid = true;
    } else {
      document.getElementById('firstName').setAttribute('style', 'border-color: red;');
    }

    if(this.user.lastName !== undefined && this.user.lastName !== null && this.user.lastName !== '') {
      isLastNameValid = true;
    } else {
      document.getElementById('lastName').setAttribute('style', 'border-color: red;');
    }

    if(this.user.login !== undefined && this.user.login !== null && this.user.login !== '') {
      isLoginValid = true;
    } else {
      document.getElementById('login').setAttribute('style', 'border-color: red;');
    }

    if(isFirstNameValid && isLastNameValid && isLoginValid) {
      isValid = true;
    } else {
      this.pageNotificationService.addErrorMsg('Favor informar os campos obrigatórios!');
    }

    return isValid;
  }

  private returnInputToNormalStyle() {
      document.getElementById('firstName').setAttribute('style', 'border-color: #bdbdbd;');
      document.getElementById('lastName').setAttribute('style', 'border-color: #bdbdbd;');
      document.getElementById('login').setAttribute('style', 'border-color: #bdbdbd;');
  }

  private subscribeToSaveResponse(result: Observable<User>) {
    result.subscribe((res: User) => {
      this.isSaving = false;
      this.router.navigate(['/admin/user']);
      this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;

      switch(error.status) {
        case 400: {
          const EXISTING_USER = 'error.userexists';
          const EXISTING_MAIL =  'error.emailexists'
          console.log(error.headers.toJSON());
          if(error.headers.toJSON()["x-abacoapp-error"][0] === EXISTING_USER) {
            this.pageNotificationService.addErrorMsg('Login já existente.');
            document.getElementById('login').setAttribute('style', 'border-color: red;');
          } else {
            if(error.headers.toJSON()["x-abacoapp-error"][0] === EXISTING_MAIL) {
              this.pageNotificationService.addErrorMsg('Email ja existente.');
              document.getElementById('email').setAttribute('style', 'border-color: red;');
            }
            let invalidFieldNamesString = "";
            const fieldErrors = JSON.parse(error["_body"]).fieldErrors;
            invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
            this.pageNotificationService.addErrorMsg("Campos inválidos: " + invalidFieldNamesString);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
