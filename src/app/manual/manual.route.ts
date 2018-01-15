import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { ManualComponent } from './manual.component';
import { ManualDetailComponent } from './manual-detail.component';
import { ManualFormComponent } from './manual-form.component';

import { AuthGuard } from '@basis/angular-components';

export const manualRoute: Routes = [
  {
    path: 'manual',
    component: ManualComponent,
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
    path: 'manual/:id',
    component: ManualDetailComponent,
    canActivate: [AuthGuard]
  },
];
