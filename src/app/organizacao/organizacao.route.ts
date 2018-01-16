import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { OrganizacaoComponent } from './organizacao.component';
import { OrganizacaoDetailComponent } from './organizacao-detail.component';
import { OrganizacaoFormComponent } from './organizacao-form.component';

import { AuthGuard } from '@basis/angular-components';

export const organizacaoRoute: Routes = [
  {
    path: 'organizacao',
    component: OrganizacaoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/new',
    component: OrganizacaoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/:id/edit',
    component: OrganizacaoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/:id',
    component: OrganizacaoDetailComponent,
    canActivate: [AuthGuard]
  },
];
