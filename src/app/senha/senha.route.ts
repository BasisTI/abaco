import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { SenhaComponent } from './senha.component';
import { SenhaFormComponent } from './senha.form-component';

export const senhaRoute: Routes = [
  {
    path: 'senha',
    component: SenhaComponent
  },
  {
    path: 'senha/edit/:login',
    component: SenhaFormComponent
  }
];
