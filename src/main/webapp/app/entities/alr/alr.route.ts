import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { AlrComponent } from './alr.component';
import { AlrDetailComponent } from './alr-detail.component';
import { AlrPopupComponent } from './alr-dialog.component';
import { AlrDeletePopupComponent } from './alr-delete-dialog.component';

import { Principal } from '../../shared';


export const alrRoute: Routes = [
  {
    path: 'alr',
    component: AlrComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.alr.home.title'
    }
  }, {
    path: 'alr/:id',
    component: AlrDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.alr.home.title'
    }
  }
];

export const alrPopupRoute: Routes = [
  {
    path: 'alr-new',
    component: AlrPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.alr.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'alr/:id/edit',
    component: AlrPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.alr.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'alr/:id/delete',
    component: AlrDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.alr.home.title'
    },
    outlet: 'popup'
  }
];
