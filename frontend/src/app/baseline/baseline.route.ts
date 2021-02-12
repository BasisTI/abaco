import { Routes } from '@angular/router';

import {BaselineComponent} from './sintetico/baseline.component';
import { BaselineViewComponent } from './analitico/baseline-view.component';
import { AuthGuard } from '@nuvem/angular-base';


export const baselineRoute: Routes = [
  {
    path: 'baseline',
    component: BaselineComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'baseline/:id/:equipe',
    component: BaselineViewComponent,
    canActivate: [AuthGuard]
  }
];
