import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { ModuloComponent } from './modulo.component';
import { ModuloDetailComponent } from './modulo-detail.component';
import { ModuloFormComponent } from './modulo-form.component';

export const moduloRoute: Routes = [
  {
    path: 'modulo',
    component: ModuloComponent
  },
  {
    path: 'modulo/new',
    component: ModuloFormComponent
  },
  {
    path: 'modulo/:id/edit',
    component: ModuloFormComponent
  },
  {
    path: 'modulo/:id',
    component: ModuloDetailComponent
  },
];
