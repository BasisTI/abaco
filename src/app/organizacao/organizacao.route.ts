import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { OrganizacaoComponent } from './organizacao.component';
import { OrganizacaoDetailComponent } from './organizacao-detail.component';
import { OrganizacaoFormComponent } from './organizacao-form.component';

export const organizacaoRoute: Routes = [
  {
    path: 'organizacao',
    component: OrganizacaoComponent
  },
  {
    path: 'organizacao/new',
    component: OrganizacaoFormComponent
  },
  {
    path: 'organizacao/:id/edit',
    component: OrganizacaoFormComponent
  },
  {
    path: 'organizacao/:id',
    component: OrganizacaoDetailComponent
  },
];
