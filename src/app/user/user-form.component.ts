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

import * as _ from 'lodash';

@Component({
  selector: 'jhi-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit, OnDestroy {

  tipoEquipes: TipoEquipe[];
  organizacoes: Organizacao[];
  authorities: Authority[];
  authoritiesSelectItems: SelectItem[] = [];
  selectedAuthorities: SelectItem[] = [];
  user: User;
  isSaving: boolean;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private tipoEquipeService: TipoEquipeService,
    private organizacaoService: OrganizacaoService,
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
      this.populateAuthoritiesSelectItems(this.authorities);
    });
    this.routeSub = this.route.params.subscribe(params => {
      this.user = new User();
      if (params['id']) {
        this.userService.find(params['id']).subscribe(user => {
          this.user = user;
          this.populateSelectedAuthorities(user.authorities);
        });
      }
    });
  }

  private populateAuthoritiesSelectItems(authorities: Authority[]) {
    authorities.forEach((authority, index) => {
      const authoritySelectItem = {
        label: authority.name,
        value: { id: index }
      };
      this.authoritiesSelectItems.push(authoritySelectItem);
    });
  }

  private populateSelectedAuthorities(userAuthorities: Authority[]) {
    const userAuthoritiesNames = userAuthorities.map(a => a.name);
    this.selectedAuthorities = _.filter(this.authoritiesSelectItems, authSelectItem => {
      return userAuthoritiesNames.includes(authSelectItem.label);
    });
    console.log(this.selectedAuthorities);
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
    }, (res: Response) => {
      this.isSaving = false;
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
