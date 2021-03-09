import { Routes } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';
import { AuthGuardService } from '../util/auth.guard.service';
import { ManualDetailComponent } from './manual-detail/manual-detail.component';
import { ManualFormComponent } from './manual-form/manual-form.component';
import { ManualListComponent } from './manual-list/manual-list.component';



export const manualRoute: Routes = [
    {
        path: 'manual',
        component: ManualListComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_MANUAL_ACESSAR']
        }
    },
    {
        path: 'manual/new',
        component: ManualFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_MANUAL_CADASTRAR']
        }
    },
    {
        path: 'manual/:id/edit',
        component: ManualFormComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_MANUAL_EDITAR']
        }
    },
    {
        path: 'manual/:id/view',
        component: ManualDetailComponent,
        canActivate: [AuthGuard, AuthGuardService],
        data: {
            roleParaVerificar: ['ROLE_ABACO_MANUAL_CONSULTAR']
        }
    },
];
