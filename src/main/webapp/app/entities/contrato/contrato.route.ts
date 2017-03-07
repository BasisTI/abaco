import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { ContratoComponent } from './contrato.component';
import { ContratoDetailComponent } from './contrato-detail.component';
import { ContratoPopupComponent } from './contrato-dialog.component';
import { ContratoDeletePopupComponent } from './contrato-delete-dialog.component';

import { Principal } from '../../shared';


export const contratoRoute: Routes = [
  {
    path: 'contrato',
    component: ContratoComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.contrato.home.title'
    }
  }, {
    path: 'contrato/:id',
    component: ContratoDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.contrato.home.title'
    }
  }
];

export const contratoPopupRoute: Routes = [
  {
    path: 'contrato-new',
    component: ContratoPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.contrato.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'contrato/:id/edit',
    component: ContratoPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.contrato.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'contrato/:id/delete',
    component: ContratoDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.contrato.home.title'
    },
    outlet: 'popup'
  }
];
