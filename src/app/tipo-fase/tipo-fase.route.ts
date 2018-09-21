import {Routes } from '@angular/router';
import { TipoFaseComponent } from './tipo-fase.component';
import { TipoFaseDetailComponent } from './tipo-fase-detail.component';
import { TipoFaseFormComponent } from './tipo-fase-form.component';
import { AuthGuard } from '@basis/angular-components';

export const tipoFaseRoute: Routes = [
  {
    path: 'tipoFase',
    component: TipoFaseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipoFase/new',
    component: TipoFaseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipoFase/:id/edit',
    component: TipoFaseFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tipoFase/:id',
    component: TipoFaseDetailComponent,
    canActivate: [AuthGuard]
  },
];
