import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { TipoFaseComponent } from './tipo-fase.component';
import { TipoFaseDetailComponent } from './tipo-fase-detail.component';
import { TipoFaseFormComponent } from './tipo-fase-form.component';

export const tipoFaseRoute: Routes = [
  {
    path: 'tipoFase',
    component: TipoFaseComponent
  },
  {
    path: 'tipoFase/new',
    component: TipoFaseFormComponent
  },
  {
    path: 'tipoFase/:id/edit',
    component: TipoFaseFormComponent
  },
  {
    path: 'tipoFase/:id',
    component: TipoFaseDetailComponent
  },
];
