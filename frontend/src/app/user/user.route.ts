import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from '@nuvem/angular-base';
import { AdminGuard } from '../util/admin.guard';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { AuthGuardService } from '../util/auth.guard.service';


export const userRoute: Routes = [
  {
    path: 'admin/user',
    component: UserListComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_USUARIO_ACESSAR'],
        breadcrumb: "Usuário"
    }
  },
  {
    path: 'admin/user/new',
    component: UserFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_USUARIO_CADASTRAR'],
        breadcrumb: "Usuário"
    }
  },
  {
    path: 'admin/user/:id/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_USUARIO_EDITAR'],
        breadcrumb: "Usuário"
    }
  },
  {
    path: 'admin/user/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_USUARIO_CONSULTAR'],
        breadcrumb: "Usuário"
    }
  },
  {
    path: 'usuario/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_USUARIO_EDITAR'],
        breadcrumb: "Usuário"
    }
 },
];
