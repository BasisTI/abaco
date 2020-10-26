
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { FuncaoTransacaoFormComponent } from './funcao-transacao-form.component';
import { FuncaoTransacaoDivergenceComponent } from './funcao-transacao-divergence/funcao-transacao-divergence.component';

export const funcaoTransacaoRoute: Routes = [
    {
        path: 'analise/:id/funcao-transacao',
        component: FuncaoTransacaoFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/funcao-transacao/:view',
        component: FuncaoTransacaoFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/:id/funcao-transacao',
        component: FuncaoTransacaoDivergenceComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/:id/funcao-transacao/:view',
        component: FuncaoTransacaoDivergenceComponent,
        canActivate: [AuthGuard]
    }
];
