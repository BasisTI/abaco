import { Routes } from '@angular/router';
import { ContratoDetailComponent } from './contrato-detail/contrato-detail.component';
import { ContratoFormComponent } from './contrato-form/contrato-form.component';
import { ContratoListComponent } from './contrato-list/contrato-list.component';


export const contratoRoute: Routes = [
  {
    path: 'contrato',
    component: ContratoListComponent
  },
  {
    path: 'contrato/new',
    component: ContratoFormComponent
  },
  {
    path: 'contrato/:id/edit',
    component: ContratoFormComponent
  },
  {
    path: 'contrato/:id',
    component: ContratoDetailComponent
  },
];
