import {  Routes } from '@angular/router';
import { NomenclaturaFormComponent } from './nomenclatura-form/nomenclatura-form.component';
import { AuthGuard } from '@nuvem/angular-base';
import { NomenclaturaDetailComponent } from './nomenclatura-detail/nomenclatura-detail.component';
import { AdminGuard } from '../util/admin.guard';
import { NomenclaturaListComponent } from './nomenclatura-list/nomenclatura-list.component';

export const nomenclaturaRoute: Routes = [
  {
    path: 'nomenclatura',
    component: NomenclaturaListComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'nomenclatura/new',
    component: NomenclaturaFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'nomenclatura/:id/edit',
    component: NomenclaturaFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'nomenclatura/:id/view',
    component: NomenclaturaDetailComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
];
