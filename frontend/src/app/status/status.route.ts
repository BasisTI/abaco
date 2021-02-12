import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { StatusFormComponent } from './status-form/status-form.component';
import { AuthGuard } from '@nuvem/angular-base';
import { StatusDetailComponent } from './status-detail/status-detail.component';
import { AdminGuard } from '../util/admin.guard';
import { StatusListComponent } from './status-list/status-list.component';

export const statusRoute: Routes = [
  {
    path: 'status',
    component: StatusListComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'status/new',
    component: StatusFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'status/:id/edit',
    component: StatusFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'status/:id/view',
    component: StatusDetailComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
];
