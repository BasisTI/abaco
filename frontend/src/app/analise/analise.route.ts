
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { AnaliseListComponent } from './analise-list/analise-list.component';
import { AnaliseFormComponent } from './analise-form/analise-form.component';
import { AnaliseDetailComponent } from './analise-detail/analise-detail.component';
import { AnaliseViewComponent } from './analise-view/analise-view.component';
import { AnaliseResumoComponent } from './analise-resumo/analise-resumo.component';
import { AuthGuardService } from '../util/auth.guard.service';

export const analiseRoute: Routes = [
    {
        path: 'analise',
        component: AnaliseListComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_ACESSAR'],
            breadcrumb: "Análise"
        }
    },
    {
        path: 'analise/new',
        component: AnaliseFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CADASTRAR'],
            breadcrumb: "Análise"
        }
    },
    {
        path: 'analise/:id/edit',
        component: AnaliseFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar:['ROLE_ABACO_ANALISE_EDITAR'],
            breadcrumb: "Análise"
        }
    },
    {
        path: 'analise/:id',
        component: AnaliseDetailComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CONSULTAR'],
            breadcrumb: "Análise"
        }
    },
    {
        path: 'analise/:id/view',
        component: AnaliseViewComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CONSULTAR',
            'ROLE_ABACO_ANALISE_EDITAR'],
            breadcrumb: "Análise"
        }
    },
    {
        path: 'analise/:id/resumo',
        component: AnaliseResumoComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CONSULTAR',
            'ROLE_ABACO_ANALISE_EDITAR'],
            breadcrumb: "Análise"
        }
    },
    {
        path: 'analise/:id/resumo/:view',
        component: AnaliseResumoComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CONSULTAR',
            'ROLE_ABACO_ANALISE_EDITAR'],
            breadcrumb: "Análise"
        }
    },
];
