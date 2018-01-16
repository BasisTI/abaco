import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserDetailComponent } from './user-detail.component';
import { UserFormComponent } from './user-form.component';
import { AuthGuard } from '@basis/angular-components';
import { AdminGuard } from '../admin.guard';

export const userRoute: Routes = [
  {
    path: 'admin/user',
    component: UserComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/user/new',
    component: UserFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/user/:id/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'admin/user/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
];
