import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { ModuloComponent } from './modulo.component';
import { ModuloDetailComponent } from './modulo-detail.component';
import { ModuloPopupComponent } from './modulo-dialog.component';
import { ModuloDeletePopupComponent } from './modulo-delete-dialog.component';

import { Principal } from '../../shared';


export const moduloRoute: Routes = [
  {
    path: 'modulo',
    component: ModuloComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.modulo.home.title'
    }
  }, {
    path: 'modulo/:id',
    component: ModuloDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.modulo.home.title'
    }
  }
];

export const moduloPopupRoute: Routes = [
  {
    path: 'modulo-new',
    component: ModuloPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.modulo.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'modulo/:id/edit',
    component: ModuloPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.modulo.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'modulo/:id/delete',
    component: ModuloDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.modulo.home.title'
    },
    outlet: 'popup'
  }
];
