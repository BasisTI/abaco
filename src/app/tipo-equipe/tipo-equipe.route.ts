import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { TipoEquipeComponent } from './tipo-equipe.component';
import { TipoEquipeDetailComponent } from './tipo-equipe-detail.component';
import { TipoEquipeFormComponent } from './tipo-equipe-form.component';
import { AuthGuard } from '@basis/angular-components';

export const tipoEquipeRoute: Routes = [
  {
    path: 'admin/tipoEquipe',
    component: TipoEquipeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/tipoEquipe/new',
    component: TipoEquipeFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/tipoEquipe/:id/edit',
    component: TipoEquipeFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/tipoEquipe/:id',
    component: TipoEquipeDetailComponent,
    canActivate: [AuthGuard]
  },
];
