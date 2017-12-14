import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { FatorAjusteComponent } from './fator-ajuste.component';
import { FatorAjusteDetailComponent } from './fator-ajuste-detail.component';
import { FatorAjusteFormComponent } from './fator-ajuste-form.component';

export const fatorAjusteRoute: Routes = [
  {
    path: 'fatorAjuste',
    component: FatorAjusteComponent
  },
  {
    path: 'fatorAjuste/new',
    component: FatorAjusteFormComponent
  },
  {
    path: 'fatorAjuste/:id/edit',
    component: FatorAjusteFormComponent
  },
  {
    path: 'fatorAjuste/:id',
    component: FatorAjusteDetailComponent
  },
];
