import { Routes } from '@angular/router';
import { FaseListComponent } from './fase-list/fase-list.component';
import { FaseDetailComponent } from './fase-detail/fase-detail.component';
import { FaseFormComponent } from './fase-form/fase-form.component';
import { AuthGuard } from '@nuvem/angular-base';
import { AuthGuardService } from '../util/auth.guard.service';

export const FaseRoute: Routes = [
  {
    path: 'fase',
    component: FaseListComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_FASE_ACESSAR'
    }
  },
  {
    path: 'fase/new',
    component: FaseFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_FASE_CADASTRAR'
    }
  },
  {
    path: 'fase/:id/edit',
    component: FaseFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_FASE_EDITAR'
    }
  },
  {
    path: 'fase/:id',
    component: FaseDetailComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_FASE_CONSULTAR'
    }
  },
];
