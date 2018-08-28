import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { SenhaComponent } from './senha.component';

export const senhaRoute: Routes = [
  {
    path: 'senha',
    component: SenhaComponent
  }
];
