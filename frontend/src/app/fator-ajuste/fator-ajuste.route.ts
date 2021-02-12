import { Routes } from '@angular/router';
import { FatorAjusteListComponent } from './fator-ajuste-list/fator-ajuste-list.component';
import { FatorAjusteDetailComponent } from './fator-ajuste-detail/fator-ajuste-detail.component';
import { FatorAjusteFormComponent } from './fator-ajuste-form/fator-ajuste-form.component';


export const fatorAjusteRoute: Routes = [
  {
    path: 'fatorAjuste',
    component: FatorAjusteListComponent
  },
  {
    path: 'fatorAjuste/new',
    component: FatorAjusteFormComponent
  },
  {
    path: 'fatorAjuste/:id/edit',
    component: FatorAjusteFormComponent
  },
  {
    path: 'fatorAjuste/:id',
    component: FatorAjusteDetailComponent
  },
];
