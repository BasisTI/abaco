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
    private pageNotificationService: PageNotificationService,
  ) { }

  ngOnInit() {
    this.isSaving = false;
    this.recuperarListaEquipe();
    this.recuperarListaOrganizacao();
    this.recuperarListaPerfis();
    this.recuperarUsuarioPeloId();
  }

  private recuperarListaEquipe() {
    this.tipoEquipeService.query().subscribe((res: ResponseWrapper) => {
      this.tipoEquipes = res.json;
    });
  }

  private recuperarListaOrganizacao() {
    this.organizacaoService.findActiveOrganizations().subscribe((res) => {
      this.organizacoes = res;
    });
  }

  private recuperarListaPerfis() {
    this.userService.authorities().subscribe((res: Authority[]) => {
      this.authorities = res;
      this.populateAuthoritiesArtificialIds();
    });
  }

  private recuperarUsuarioPeloId() {
    this.routeSub = this.route.params.subscribe(params => {
      this.user = new User();
      this.user.activated = true;
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
      switch (index){
        case 0: {
          authority.description = "Administrador";
          break;
        }

        case 1: {
          authority.description = "Usuário";
          break;
        }
      }
    });
  }

  // FIXME Solução rápida e ruim. O(n^2) no pior caso
  // Funciona para qualquer autoridade que vier no banco
  // Em oposição a uma solução mais simples porém hardcoded.
  private populateUserAuthoritiesWithArtificialId() {
    this.user.authorities.forEach(authority => {
      this.authorities.forEach(userAuthority => {
        if (authority.name === userAuthority.name) {
          userAuthority.artificialId = authority.artificialId;
        }
      });
    });
  }

  /**
   *
   * */
  save(form) {
    if ( !form.valid ) {
      this.pageNotificationService.addErrorMsg('Favor preencher os campos Obrigatórios!');
      return;
    }
    if (this.user.id !== undefined) {
      this.subscribeToSaveResponse(this.userService.update(this.user));
    } else {
      this.subscribeToSaveResponse(this.userService.create(this.user));
    }
  }

  /**
   *
   * */
  private isUsernamesValid(): boolean {
    let isValid = false;
    this.returnInputToNormalStyle();
    let isFirstNameValid = false;
    let isLastNameValid = false;
    let isLoginValid = false;

    isFirstNameValid = this.validarObjeto(this.user.firstName);
    isLastNameValid = this.validarObjeto(this.user.lastName);
    isLoginValid = this.validarObjeto(this.user.login);

    if (isFirstNameValid && isLastNameValid && isLoginValid) {
      isValid = true;
    } else {
      this.pageNotificationService.addErrorMsg('Favor informar os campos obrigatórios!');
    }
    return isValid;
  }

  /**
   *
   * */
  private validarObjeto(text: string): boolean {
    if (text !== undefined && text !== null && text !== '') {
      return true;
    } else {
      document.getElementById('text').setAttribute('style', 'border-color: red;');
      return false;
    }
  }

  /**
   *
   * */
  private returnInputToNormalStyle() {
      document.getElementById('firstName').setAttribute('style', 'border-color: #bdbdbd;');
      document.getElementById('lastName').setAttribute('style', 'border-color: #bdbdbd;');
      document.getElementById('login').setAttribute('style', 'border-color: #bdbdbd;');
      document.getElementById('email').setAttribute('style', 'border-color: #bdbdbd;');
  }

  /**
   *
   * */
  private subscribeToSaveResponse(result: Observable<User>) {
    result.subscribe((res: User) => {
      this.isSaving = false;
      this.router.navigate(['/admin/user']);
      this.pageNotificationService.addCreateMsg();
    }, (error: Response) => {
      this.isSaving = false;

      switch (error.status) {
        case 400: {
          const EXISTING_USER = 'error.userexists';
          const EXISTING_MAIL =  'error.emailexists';
          const EXISTING_FULLNAME = 'error.fullnameexists';

          if (error.headers.toJSON()['x-abacoapp-error'][0] === EXISTING_USER) {
            this.pageNotificationService.addErrorMsg('Registro já cadastrado!');
            document.getElementById('login').setAttribute('style', 'border-color: red;');
          } else {
            if (error.headers.toJSON()['x-abacoapp-error'][0] === EXISTING_MAIL) {
              this.pageNotificationService.addErrorMsg('Registro já cadastrado!');
              document.getElementById('email').setAttribute('style', 'border-color: red;');
            } else {
              if (error.headers.toJSON()['x-abacoapp-error'][0] === EXISTING_FULLNAME) {
                this.pageNotificationService.addErrorMsg('Registro já cadastrado!');
                document.getElementById('firstName').setAttribute('style', 'border-color: red;');
                document.getElementById('lastName').setAttribute('style', 'border-color: red;');
              }
            }
            let invalidFieldNamesString = '';
            const fieldErrors = JSON.parse(error['_body']).fieldErrors;
            invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
            this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldNamesString);
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
