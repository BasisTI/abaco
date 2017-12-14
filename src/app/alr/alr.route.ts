import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { AlrComponent } from './alr.component';
import { AlrDetailComponent } from './alr-detail.component';
import { AlrFormComponent } from './alr-form.component';

export const alrRoute: Routes = [
  {
    path: 'alr',
    component: AlrComponent
  },
  {
    path: 'alr/new',
    component: AlrFormComponent
  },
  {
    path: 'alr/:id/edit',
    component: AlrFormComponent
  },
  {
    path: 'alr/:id',
    component: AlrDetailComponent
  },
];
