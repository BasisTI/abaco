import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { RlrComponent } from './rlr.component';
import { RlrDetailComponent } from './rlr-detail.component';
import { RlrPopupComponent } from './rlr-dialog.component';
import { RlrDeletePopupComponent } from './rlr-delete-dialog.component';

import { Principal } from '../../shared';


export const rlrRoute: Routes = [
  {
    path: 'rlr',
    component: RlrComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.rlr.home.title'
    }
  }, {
    path: 'rlr/:id',
    component: RlrDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.rlr.home.title'
    }
  }
];

export const rlrPopupRoute: Routes = [
  {
    path: 'rlr-new',
    component: RlrPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.rlr.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'rlr/:id/edit',
    component: RlrPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.rlr.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'rlr/:id/delete',
    component: RlrDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.rlr.home.title'
    },
    outlet: 'popup'
  }
];
