import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { ManualComponent } from './manual.component';
import { ManualDetailComponent } from './manual-detail.component';
import { ManualFormComponent } from './manual-form.component';

export const manualRoute: Routes = [
  {
    path: 'manual',
    component: ManualComponent
  },
  {
    path: 'manual/new',
    component: ManualFormComponent
  },
  {
    path: 'manual/:id/edit',
    component: ManualFormComponent
  },
  {
    path: 'manual/:id',
    component: ManualDetailComponent
  },
];
