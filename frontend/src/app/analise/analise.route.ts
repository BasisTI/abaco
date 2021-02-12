
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { AnaliseListComponent } from './analise-list/analise-list.component';
import { AnaliseFormComponent } from './analise-form/analise-form.component';
import { AnaliseDetailComponent } from './analise-detail/analise-detail.component';
import { AnaliseViewComponent } from './analise-view/analise-view.component';
import { AnaliseResumoComponent } from './analise-resumo/analise-resumo.component';

export const analiseRoute: Routes = [
    {
        path: 'analise',
        component: AnaliseListComponent,
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
        path: 'analise/:id/resumo',
        component: AnaliseResumoComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'analise/:id/resumo/:view',
        component: AnaliseResumoComponent,
        canActivate: [AuthGuard]
    },
];
