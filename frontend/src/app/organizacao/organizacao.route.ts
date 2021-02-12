import { Routes } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';
import { OrganizacaoDetailComponent } from './organizacao-detail/organizacao-detail.component';
import { OrganizacaoFormComponent } from './organizacao-form/organizacao-form.component';
import { OrganizacaoListComponent } from './organizacao-list/organizacao-list.component';


export const organizacaoRoute: Routes = [
  {
    path: 'organizacao',
    component: OrganizacaoListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/new',
    component: OrganizacaoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/:id/edit',
    component: OrganizacaoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'organizacao/:id',
    component: OrganizacaoDetailComponent,
    canActivate: [AuthGuard]
  },
];
