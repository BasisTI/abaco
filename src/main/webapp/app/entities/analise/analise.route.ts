import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { AnaliseComponent } from './analise.component';
import { AnaliseDetailComponent } from './analise-detail.component';
import {AnaliseDialogComponent, AnalisePopupComponent} from './analise-dialog.component';
import { AnaliseDeletePopupComponent } from './analise-delete-dialog.component';

import { Principal } from '../../shared';


export const analiseRoute: Routes = [
  {
    path: 'analise',
    component: AnaliseComponent,
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
