import { Routes } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';
import { AuthGuardService } from '../util/auth.guard.service';
import { PerfilDetailComponent } from './perfil-detail/perfil-detail.component';
import { PerfilFormComponent } from './perfil-form/perfil-form.component';
import { PerfilListComponent } from './perfil-list/perfil-list.component';



export const perfilRoute: Routes = [
    {
        path: 'perfil',
        component: PerfilListComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_PERFIL_ACESSAR'],
            breadcrumb: "Perfil"
        }
    },
    {
        path: 'perfil/new',
        component: PerfilFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_PERFIL_CADASTRAR'],
            breadcrumb: "Perfil"
        }
    },
    {
        path: 'perfil/:id/edit',
        component: PerfilFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_PERFIL_EDITAR'],
            breadcrumb: "Perfil"
        }
    },
    {
        path: 'perfil/:id/view',
        component: PerfilDetailComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_PERFIL_CONSULTAR'],
            breadcrumb: "Perfil"
        }
    },
];
