import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { AnaliseComponent } from './analise.component';
import { AnaliseDetailComponent } from './analise-detail.component';
import {AnaliseDialogComponent, AnalisePopupComponent} from './analise-dialog.component';
import { AnaliseDeletePopupComponent } from './analise-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class AnaliseResolvePagingParams implements Resolve<any> {

  constructor(private paginationUtil: PaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      let page = route.queryParams['page'] ? route.queryParams['page'] : '1';
      let sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
      return {
          page: this.paginationUtil.parsePage(page),
          predicate: this.paginationUtil.parsePredicate(sort),
          ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const analiseRoute: Routes = [
  {
    path: 'analise',
    component: AnaliseComponent,
    resolve: {
      'pagingParams': AnaliseResolvePagingParams
    },
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.analise.home.title'
    }
  }, {
    path: 'analise/:id',
    component: AnaliseDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.analise.home.title'
    }
  }, {
        path: 'analise/editor/:id',
        component: AnaliseDialogComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'abacoApp.analise.home.title'
        }
    }
];

export const analisePopupRoute: Routes = [
  {
    path: 'analise-new',
    component: AnalisePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.analise.home.title'
    },
    outlet: 'popup'
  },
    //{
    //  path: 'analise/:id/edit',
    //  component: AnalisePopupComponent,
    //  data: {
    //      authorities: ['ROLE_USER'],
    //      pageTitle: 'abacoApp.analise.home.title'
    //  },
    //  outlet: 'popup'
    //},
    {
    path: 'analise/:id/delete',
    component: AnaliseDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.analise.home.title'
    },
    outlet: 'popup'
  }
];
