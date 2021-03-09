import { Routes } from '@angular/router';

import {BaselineComponent} from './sintetico/baseline.component';
import { BaselineViewComponent } from './analitico/baseline-view.component';
import { AuthGuard } from '@nuvem/angular-base';
import { AuthGuardService } from '../util/auth.guard.service';


export const baselineRoute: Routes = [
  {
    path: 'baseline',
    component: BaselineComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_BASELINE_ACESSAR']
    }
  },
  {
    path: 'baseline/:id/:equipe',
    component: BaselineViewComponent,
    canActivate: [AuthGuard, AuthGuardService],
    data: {
        roleParaVerificar: ['ROLE_ABACO_BASELINE_CONSULTAR']
    }
  }
];
