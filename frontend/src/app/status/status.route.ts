import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { StatusFormComponent } from './status-form/status-form.component';
import { AuthGuard } from '@nuvem/angular-base';
import { StatusDetailComponent } from './status-detail/status-detail.component';
import { AdminGuard } from '../util/admin.guard';
import { StatusListComponent } from './status-list/status-list.component';
import { AuthGuardService } from '../util/auth.guard.service';

export const statusRoute: Routes = [
  {
    path: 'status',
    component: StatusListComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_STATUS_ACESSAR'
    }
  },
  {
    path: 'status/new',
    component: StatusFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_STATUS_CADASTRAR'
    }
  },
  {
    path: 'status/:id/edit',
    component: StatusFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_STATUS_EDITAR'
    }
  },
  {
    path: 'status/:id/view',
    component: StatusDetailComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_STATUS_CONSULTAR'
    }
  },
];
