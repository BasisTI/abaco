
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { FuncaoDadosFormComponent } from './funcao-dados-form.component';
import { FuncaoDadosDivergenceComponent } from './funcao-dados-divergence/funcao-dados-divergence.component';

export const funcaoDadosRoute: Routes = [
    {
        path: 'analise/:id/funcao-dados',
        component: FuncaoDadosFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/funcao-dados/:view',
        component: FuncaoDadosFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/:id/funcao-dados',
        component: FuncaoDadosDivergenceComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/:id/funcao-dados/:view',
        component: FuncaoDadosDivergenceComponent,
        canActivate: [AuthGuard]
    },
];
