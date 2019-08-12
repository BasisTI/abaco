import { Routes } from '@angular/router';

import { AnaliseComponent } from './analise.component';
import { AnaliseDetailComponent } from './analise-detail.component';
import { AnaliseFormComponent } from './analise-form.component';
import { AnaliseViewComponent } from './analise-view.component';
import { AuthGuard } from '@basis/angular-components';

export const analiseRoute: Routes = [
  {
    path: 'analise',
    component: AnaliseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analise/new',
    component: AnaliseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analise/:id/edit',
    component: AnaliseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analise/:id',
    component: AnaliseDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'analise/:id/view',
    component: AnaliseViewComponent,
    canActivate: [AuthGuard]
  },
];
