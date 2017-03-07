import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { EsforcoFaseComponent } from './esforco-fase.component';
import { EsforcoFaseDetailComponent } from './esforco-fase-detail.component';
import { EsforcoFasePopupComponent } from './esforco-fase-dialog.component';
import { EsforcoFaseDeletePopupComponent } from './esforco-fase-delete-dialog.component';

import { Principal } from '../../shared';


export const esforcoFaseRoute: Routes = [
  {
    path: 'esforco-fase',
    component: EsforcoFaseComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.esforcoFase.home.title'
    }
  }, {
    path: 'esforco-fase/:id',
    component: EsforcoFaseDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.esforcoFase.home.title'
    }
  }
];

export const esforcoFasePopupRoute: Routes = [
  {
    path: 'esforco-fase-new',
    component: EsforcoFasePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.esforcoFase.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'esforco-fase/:id/edit',
    component: EsforcoFasePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.esforcoFase.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'esforco-fase/:id/delete',
    component: EsforcoFaseDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.esforcoFase.home.title'
    },
    outlet: 'popup'
  }
];
