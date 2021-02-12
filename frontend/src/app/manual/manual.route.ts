import { Routes } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';
import { ManualDetailComponent } from './manual-detail/manual-detail.component';
import { ManualFormComponent } from './manual-form/manual-form.component';
import { ManualListComponent } from './manual-list/manual-list.component';



export const manualRoute: Routes = [
    {
        path: 'manual',
        component: ManualListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'manual/new',
        component: ManualFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'manual/:id/edit',
        component: ManualFormComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'manual/:id/view',
        component: ManualDetailComponent,
        canActivate: [AuthGuard]
    },
];
