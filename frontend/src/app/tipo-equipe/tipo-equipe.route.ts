import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { TipoEquipeFormComponent } from './tipo-equipe-form/tipo-equipe-form.component';
import { AuthGuard } from '@nuvem/angular-base';
import { TipoEquipeDetailComponent } from './tipo-equipe-detail/tipo-equipe-detail.component';
import { AdminGuard } from '../util/admin.guard';
import { TipoEquipeListComponent } from './tipo-equipe-list/tipo-equipe-list.component';
import { AuthGuardService } from '../util/auth.guard.service';

export const tipoEquipeRoute: Routes = [
  {
    path: 'admin/tipoEquipe',
    component: TipoEquipeListComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_TIPO_EQUIPE_ACESSAR'
    }
  },
  {
    path: 'admin/tipoEquipe/new',
    component: TipoEquipeFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_TIPO_EQUIPE_CADASTRAR'
    }
  },
  {
    path: 'admin/tipoEquipe/:id/edit',
    component: TipoEquipeFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_TIPO_EQUIPE_EDITAR'
    }
  },
  {
    path: 'admin/tipoEquipe/:id',
    component: TipoEquipeDetailComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_TIPO_EQUIPE_CONSULTAR'
    }
  },
];
