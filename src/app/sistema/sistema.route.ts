import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { SistemaComponent } from './sistema.component';
import { SistemaDetailComponent } from './sistema-detail.component';
import { SistemaFormComponent } from './sistema-form.component';

export const sistemaRoute: Routes = [
  {
    path: 'sistema',
    component: SistemaComponent
  },
  {
    path: 'sistema/new',
    component: SistemaFormComponent
  },
  {
    path: 'sistema/:id/edit',
    component: SistemaFormComponent
  },
  {
    path: 'sistema/:id',
    component: SistemaDetailComponent
  },
];
