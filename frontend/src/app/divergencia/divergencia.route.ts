
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { DivergenciaListComponent } from './divergencia-list/divergencia-list.component';
import { DivergenciaFormComponent } from './divergencia-form/divergencia-form.component';
import { DivergenciaDetailComponent } from './divergencia-detail/divergencia-detail.component';
import { DivergenciaResumoComponent } from './divergencia-resumo/divergencia-resumo.component';

export const divergenciaRoute: Routes = [
    {
        path: 'divergencia',
        component: DivergenciaListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/new',
        component: DivergenciaFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/:id/edit',
        component: DivergenciaFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/:id/view',
        component: DivergenciaDetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/:id/resumo',
        component: DivergenciaResumoComponent,
        canActivate: [AuthGuard]
    },

];
