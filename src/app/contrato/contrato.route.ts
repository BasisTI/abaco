import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { ContratoComponent } from './contrato.component';
import { ContratoDetailComponent } from './contrato-detail.component';
import { ContratoFormComponent } from './contrato-form.component';

export const contratoRoute: Routes = [
  {
    path: 'contrato',
    component: ContratoComponent
  },
  {
    path: 'contrato/new',
    component: ContratoFormComponent
  },
  {
    path: 'contrato/:id/edit',
    component: ContratoFormComponent
  },
  {
    path: 'contrato/:id',
    component: ContratoDetailComponent
  },
];
