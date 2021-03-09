import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { SistemaDetailComponent } from './sistema-detail/sistema-detail.component';
import { SistemaFormComponent } from './sistema-form/sistema-form.component';

import { SistemaListComponent } from './sistema-list/sistema-list.component';
import { AuthGuard } from '@nuvem/angular-base';
import { AuthGuardService } from '../util/auth.guard.service';

export const sistemaRoute: Routes = [
  {
    path: 'sistema',
    component: SistemaListComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_SISTEMA_ACESSAR']
    }
  },
  {
    path: 'sistema/new',
    component: SistemaFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_SISTEMA_CADASTRAR']
    }
  },
  {
    path: 'sistema/:id/edit',
    component: SistemaFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_SISTEMA_EDITAR']
    }
  },
  {
    path: 'sistema/:id',
    component: SistemaDetailComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_SISTEMA_CONSULTAR']
    }
  },
];
