import { Routes } from '@angular/router';
import { ModuloDetailComponent } from './modulo-detail/modulo-detail.component';
import { ModuloFormComponent } from './modulo-form/modulo-form.component';
import { ModuloListComponent } from './modulo-list/modulo-list.component';


export const moduloRoute: Routes = [
  {
    path: 'modulo',
    component: ModuloListComponent
  },
  {
    path: 'modulo/new',
    component: ModuloFormComponent
  },
  {
    path: 'modulo/:id/edit',
    component: ModuloFormComponent
  },
  {
    path: 'modulo/:id',
    component: ModuloDetailComponent
  },
];
