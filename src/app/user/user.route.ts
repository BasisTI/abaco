import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserDetailComponent } from './user-detail.component';
import { UserFormComponent } from './user-form.component';

export const userRoute: Routes = [
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: 'user/new',
    component: UserFormComponent
  },
  {
    path: 'user/:id/edit',
    component: UserFormComponent
  },
  {
    path: 'user/:id',
    component: UserDetailComponent
  },
];
