import { Routes } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';
import { AuthGuardService } from '../util/auth.guard.service';
import { OrganizacaoDetailComponent } from './organizacao-detail/organizacao-detail.component';
import { OrganizacaoFormComponent } from './organizacao-form/organizacao-form.component';
import { OrganizacaoListComponent } from './organizacao-list/organizacao-list.component';


export const organizacaoRoute: Routes = [
  {
    path: 'organizacao',
    component: OrganizacaoListComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_ORGANIZACAO_ACESSAR'
    }
  },
  {
    path: 'organizacao/new',
    component: OrganizacaoFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_ORGANIZACAO_CADASTRAR'
    }
  },
  {
    path: 'organizacao/:id/edit',
    component: OrganizacaoFormComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_ORGANIZACAO_EDITAR'
    }
  },
  {
    path: 'organizacao/:id',
    component: OrganizacaoDetailComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: 'ROLE_ABACO_ORGANIZACAO_CONSULTAR'
    }
  },
];
