import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { AnaliseComponent } from './analise.component';
import { AnaliseDetailComponent } from './analise-detail.component';
import { AnaliseFormComponent } from './analise-form.component';
import { AnaliseViewComponent } from './analise-view.component';

export const analiseRoute: Routes = [
  {
    path: 'analise',
    component: AnaliseComponent
  },
  {
    path: 'analise/new',
    component: AnaliseFormComponent
  },
  {
    path: 'analise/:id/edit',
    component: AnaliseFormComponent
  },
  {
    path: 'analise/:id',
    component: AnaliseDetailComponent
  },
  {
    path: 'analise/:id/view',
    component: AnaliseViewComponent
  },
];
