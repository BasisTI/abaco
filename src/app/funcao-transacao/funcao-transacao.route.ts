
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { FuncaoTransacaoFormComponent } from './funcao-transacao-form.component';

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
    }
];
