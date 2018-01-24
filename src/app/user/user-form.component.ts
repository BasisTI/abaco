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
    this.organizacaoService.query().subscribe((res: ResponseWrapper) => {
      this.organizacoes = res.json;
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
      this.subscribeToSaveResponse(this.userService.update(this.user));
    } else {
      this.subscribeToSaveResponse(this.userService.create(this.user));
    }
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
