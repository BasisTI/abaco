import {Routes} from '@angular/router';

import {AnaliseComponent} from './analise.component';
import {AnaliseDetailComponent} from './analise-detail.component';
import {AnaliseFormComponent} from './analise-form.component';
import {AuthGuard} from '@basis/angular-components';
import {FuncaoDadosFormComponent} from '../funcao-dados';
import {FuncaoTransacaoFormComponent} from '../funcao-transacao';
import {AnaliseResumoComponent} from './resumo/analise-resumo.component';
import {AnaliseViewComponent} from './analise-view.component';

export const analiseRoute: Routes = [
    {
        path: 'analise',
        component: AnaliseComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/new',
        component: AnaliseFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/edit',
        component: AnaliseFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id',
        component: AnaliseDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/view',
        component: AnaliseViewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/funcao-dados',
        component: FuncaoDadosFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/funcao-transacao',
        component: FuncaoTransacaoFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/resumo',
        component: AnaliseResumoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/funcao-dados/:view',
        component: FuncaoDadosFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/funcao-transacao/:view',
        component: FuncaoTransacaoFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/resumo/:view',
        component: AnaliseResumoComponent,
        canActivate: [AuthGuard]
    },
];
