import { Routes } from '@angular/router';
import { FuncionalidadeListComponent } from './funcionalidade-list/funcionalidade-list.component';
import { FuncionalidadeFormComponent } from './funcionalidade-form/funcionalidade-form.component';
import { FuncionalidadeDetailComponent } from './funcionalidade-detail/funcionalidade-detail.component';


export const funcionalidadeRoute: Routes = [
  {
    path: 'funcionalidade',
    component: FuncionalidadeListComponent
  },
  {
    path: 'funcionalidade/new',
    component: FuncionalidadeFormComponent
  },
  {
    path: 'funcionalidade/:id/edit',
    component: FuncionalidadeFormComponent
  },
  {
    path: 'funcionalidade/:id',
    component: FuncionalidadeDetailComponent
  },
];
