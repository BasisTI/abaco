import {Routes } from '@angular/router';
import { FaseComponent } from './components/fase.component';
import { FaseDetailComponent } from './components/fase-detail.component';
import { FaseFormComponent } from './components/fase-form.component';
import { AuthGuard } from '@basis/angular-components';

export const FaseRoute: Routes = [
  {
    path: 'fase',
    component: FaseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fase/new',
    component: FaseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fase/:id/edit',
    component: FaseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'fase/:id',
    component: FaseDetailComponent,
    canActivate: [AuthGuard]
  },
];
