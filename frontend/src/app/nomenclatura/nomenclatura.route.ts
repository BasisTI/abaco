import {  Routes } from '@angular/router';
import { NomenclaturaFormComponent } from './nomenclatura-form/nomenclatura-form.component';
import { AuthGuard } from '@nuvem/angular-base';
import { NomenclaturaDetailComponent } from './nomenclatura-detail/nomenclatura-detail.component';
import { AdminGuard } from '../util/admin.guard';
import { NomenclaturaListComponent } from './nomenclatura-list/nomenclatura-list.component';
import { AuthGuardService } from '../util/auth.guard.service';

export const nomenclaturaRoute: Routes = [
  {
    path: 'nomenclatura',
    component: NomenclaturaListComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_NOMENCLATURA_ACESSAR']
    }
  },
  {
    path: 'nomenclatura/new',
    component: NomenclaturaFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_NOMENCLATURA_CADASTRAR']
    }
  },
  {
    path: 'nomenclatura/:id/edit',
    component: NomenclaturaFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_NOMENCLATURA_EDITAR']
    }
  },
  {
    path: 'nomenclatura/:id/view',
    component: NomenclaturaDetailComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_NOMENCLATURA_CONSULTAR']
    }
  },
];
