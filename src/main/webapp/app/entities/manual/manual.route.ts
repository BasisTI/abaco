import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { ManualComponent } from './manual.component';
import { ManualDetailComponent } from './manual-detail.component';
import { ManualPopupComponent } from './manual-dialog.component';
import { ManualDeletePopupComponent } from './manual-delete-dialog.component';

import { Principal } from '../../shared';


export const manualRoute: Routes = [
  {
    path: 'manual',
    component: ManualComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.manual.home.title'
    }
  }, {
    path: 'manual/:id',
    component: ManualDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.manual.home.title'
    }
  }
];

export const manualPopupRoute: Routes = [
  {
    path: 'manual-new',
    component: ManualPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.manual.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'manual/:id/edit',
    component: ManualPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.manual.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'manual/:id/delete',
    component: ManualDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.manual.home.title'
    },
    outlet: 'popup'
  }
];
