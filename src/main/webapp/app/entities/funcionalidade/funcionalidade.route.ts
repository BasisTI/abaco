import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { FuncionalidadeComponent } from './funcionalidade.component';
import { FuncionalidadeDetailComponent } from './funcionalidade-detail.component';
import { FuncionalidadePopupComponent } from './funcionalidade-dialog.component';
import { FuncionalidadeDeletePopupComponent } from './funcionalidade-delete-dialog.component';

import { Principal } from '../../shared';


export const funcionalidadeRoute: Routes = [
  {
    path: 'funcionalidade',
    component: FuncionalidadeComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcionalidade.home.title'
    }
  }, {
    path: 'funcionalidade/:id',
    component: FuncionalidadeDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcionalidade.home.title'
    }
  }
];

export const funcionalidadePopupRoute: Routes = [
  {
    path: 'funcionalidade-new',
    component: FuncionalidadePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcionalidade.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'funcionalidade/:id/edit',
    component: FuncionalidadePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcionalidade.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'funcionalidade/:id/delete',
    component: FuncionalidadeDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcionalidade.home.title'
    },
    outlet: 'popup'
  }
];
