import {Routes } from '@angular/router';
import { FaseListComponent } from './fase-list/fase-list.component';
import { FaseDetailComponent } from './fase-detail/fase-detail.component';
import { FaseFormComponent } from './fase-form/fase-form.component';
import { AuthGuard } from '@nuvem/angular-base';

export const FaseRoute: Routes = [
  {
    path: 'fase',
    component: FaseListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fase/new',
    component: FaseFormComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Fase'} 
  },
  {
    path: 'fase/:id/edit',
    component: FaseFormComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Fase'} 
  },
  {
    path: 'fase/:id',
    component: FaseDetailComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Fase'} 
  },
];
