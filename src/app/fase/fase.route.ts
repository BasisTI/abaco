import {Routes } from '@angular/router';
import { FaseComponent } from './fase.component';
import { FaseDetailComponent } from './fase-detail.component';
import { FaseFormComponent } from './fase-form.component';
import { AuthGuard } from '@basis/angular-components';

export const FaseRoute: Routes = [
  {
    path: 'tipoFase',
    component: FaseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipoFase/new',
    component: FaseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipoFase/:id/edit',
    component: FaseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipoFase/:id',
    component: FaseDetailComponent,
    canActivate: [AuthGuard]
  },
];
