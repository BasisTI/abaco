
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { FuncaoTransacaoFormComponent } from './funcao-transacao-form.component';
import { FuncaoTransacaoDivergenceComponent } from './funcao-transacao-divergence/funcao-transacao-divergence.component';
import { AuthGuardService } from '../util/auth.guard.service';

export const funcaoTransacaoRoute: Routes = [
    {
        path: 'analise/:id/funcao-transacao',
        component: FuncaoTransacaoFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CONSULTAR',
            'ROLE_ABACO_ANALISE_EDITAR']
        }
    },
    {
        path: 'analise/:id/funcao-transacao/:view',
        component: FuncaoTransacaoFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_ANALISE_CONSULTAR',
            'ROLE_ABACO_ANALISE_EDITAR']
        }
    },
    {
        path: 'divergencia/:id/funcao-transacao',
        component: FuncaoTransacaoDivergenceComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_VALIDACAO_EDITAR']
        }
    },
    {
        path: 'divergencia/:id/funcao-transacao/:view',
        component: FuncaoTransacaoDivergenceComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_VALIDACAO_EDITAR']
        }
    }
];
