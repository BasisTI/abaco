
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { FuncaoDadosFormComponent } from './funcao-dados-form.component';
import { FuncaoDadosDivergenceComponent } from './funcao-dados-divergence/funcao-dados-divergence.component';
import { AuthGuardService } from '../util/auth.guard.service';

export const funcaoDadosRoute: Routes = [
    {
        path: 'analise/:id/funcao-dados',
        component: FuncaoDadosFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CONSULTAR',
            'ROLE_ABACO_ANALISE_EDITAR']
        }
    },
    {
        path: 'analise/:id/funcao-dados/:view',
        component: FuncaoDadosFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CONSULTAR',
            'ROLE_ABACO_ANALISE_EDITAR']
        }
    },
    {
        path: 'divergencia/:id/funcao-dados',
        component: FuncaoDadosDivergenceComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_DIVERGENCIA_EDITAR']
        }
    },
    {
        path: 'divergencia/:id/funcao-dados/:view',
        component: FuncaoDadosDivergenceComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_DIVERGENCIA_EDITAR']
        }
    },
];
