import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { LoginComponent } from './login.component';

export const loginRoute: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }
];
