import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { DerComponent } from './der.component';
import { DerDetailComponent } from './der-detail.component';
import { DerPopupComponent } from './der-dialog.component';
import { DerDeletePopupComponent } from './der-delete-dialog.component';

import { Principal } from '../../shared';


export const derRoute: Routes = [
  {
    path: 'der',
    component: DerComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.der.home.title'
    }
  }, {
    path: 'der/:id',
    component: DerDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.der.home.title'
    }
  }
];

export const derPopupRoute: Routes = [
  {
    path: 'der-new',
    component: DerPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.der.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'der/:id/edit',
    component: DerPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.der.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'der/:id/delete',
    component: DerDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.der.home.title'
    },
    outlet: 'popup'
  }
];
