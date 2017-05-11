import { Route } from '@angular/router';
import { UserRouteAccessService } from '../../shared';
import { AnalisEditComponent } from './edit.component';

export const editRoute: Route = {
  path: 'edit',
  component: AnalisEditComponent,
  data: {
    authorities: [],
    pageTitle: 'activate.title'
  },
  canActivate: [UserRouteAccessService]
};
