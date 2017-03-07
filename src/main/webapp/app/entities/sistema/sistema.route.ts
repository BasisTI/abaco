import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { SistemaComponent } from './sistema.component';
import { SistemaDetailComponent } from './sistema-detail.component';
import { SistemaPopupComponent } from './sistema-dialog.component';
import { SistemaDeletePopupComponent } from './sistema-delete-dialog.component';

import { Principal } from '../../shared';


export const sistemaRoute: Routes = [
  {
    path: 'sistema',
    component: SistemaComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.sistema.home.title'
    }
  }, {
    path: 'sistema/:id',
    component: SistemaDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.sistema.home.title'
    }
  }
];

export const sistemaPopupRoute: Routes = [
  {
    path: 'sistema-new',
    component: SistemaPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.sistema.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'sistema/:id/edit',
    component: SistemaPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.sistema.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'sistema/:id/delete',
    component: SistemaDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.sistema.home.title'
    },
    outlet: 'popup'
  }
];
