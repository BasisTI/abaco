
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { DivergenciaListComponent } from './divergencia-list/divergencia-list.component';
import { DivergenciaFormComponent } from './divergencia-form/divergencia-form.component';
import { DivergenciaDetailComponent } from './divergencia-detail/divergencia-detail.component';
import { DivergenciaResumoComponent } from './divergencia-resumo/divergencia-resumo.component';
import { AuthGuardService } from '../util/auth.guard.service';

export const divergenciaRoute: Routes = [
    {
        path: 'divergencia',
        component: DivergenciaListComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: 'ROLE_ABACO_DIVERGENCIA_ACESSAR'
        }
    },
    {
        path: 'divergencia/new',
        component: DivergenciaFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: 'ROLE_ABACO_DIVERGENCIA_EDITAR'
        }
    },
    {
        path: 'divergencia/:id/edit',
        component: DivergenciaFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'divergencia/:id/view',
        component: DivergenciaDetailComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: 'ROLE_ABACO_DIVERGENCIA_ACESSAR'
        }
    },
    {
        path: 'divergencia/:id/resumo',
        component: DivergenciaResumoComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: 'ROLE_ABACO_DIVERGENCIA_ACESSAR'
        }
    },

];
