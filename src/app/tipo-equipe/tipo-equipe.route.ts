import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { TipoEquipeComponent } from './tipo-equipe.component';
import { TipoEquipeDetailComponent } from './tipo-equipe-detail.component';
import { TipoEquipeFormComponent } from './tipo-equipe-form.component';

export const tipoEquipeRoute: Routes = [
  {
    path: 'tipoEquipe',
    component: TipoEquipeComponent
  },
  {
    path: 'tipoEquipe/new',
    component: TipoEquipeFormComponent
  },
  {
    path: 'tipoEquipe/:id/edit',
    component: TipoEquipeFormComponent
  },
  {
    path: 'tipoEquipe/:id',
    component: TipoEquipeDetailComponent
  },
];
