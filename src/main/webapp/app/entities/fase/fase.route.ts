import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { FaseComponent } from './fase.component';
import { FaseDetailComponent } from './fase-detail.component';
import { FasePopupComponent } from './fase-dialog.component';
import { FaseDeletePopupComponent } from './fase-delete-dialog.component';

import { Principal } from '../../shared';


export const faseRoute: Routes = [
  {
    path: 'fase',
    component: FaseComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fase.home.title'
    }
  }, {
    path: 'fase/:id',
    component: FaseDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fase.home.title'
    }
  }
];

export const fasePopupRoute: Routes = [
  {
    path: 'fase-new',
    component: FasePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fase.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'fase/:id/edit',
    component: FasePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fase.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'fase/:id/delete',
    component: FaseDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fase.home.title'
    },
    outlet: 'popup'
  }
];
