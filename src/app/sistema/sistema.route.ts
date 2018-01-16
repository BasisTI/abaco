import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { SistemaComponent } from './sistema.component';
import { SistemaDetailComponent } from './sistema-detail.component';
import { SistemaFormComponent } from './sistema-form.component';

import { AuthGuard } from '@basis/angular-components';

export const sistemaRoute: Routes = [
  {
    path: 'sistema',
    component: SistemaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sistema/new',
    component: SistemaFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sistema/:id/edit',
    component: SistemaFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sistema/:id',
    component: SistemaDetailComponent,
    canActivate: [AuthGuard]
  },
];
