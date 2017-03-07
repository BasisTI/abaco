import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { FuncaoDadosComponent } from './funcao-dados.component';
import { FuncaoDadosDetailComponent } from './funcao-dados-detail.component';
import { FuncaoDadosPopupComponent } from './funcao-dados-dialog.component';
import { FuncaoDadosDeletePopupComponent } from './funcao-dados-delete-dialog.component';

import { Principal } from '../../shared';


export const funcaoDadosRoute: Routes = [
  {
    path: 'funcao-dados',
    component: FuncaoDadosComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoDados.home.title'
    }
  }, {
    path: 'funcao-dados/:id',
    component: FuncaoDadosDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoDados.home.title'
    }
  }
];

export const funcaoDadosPopupRoute: Routes = [
  {
    path: 'funcao-dados-new',
    component: FuncaoDadosPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoDados.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'funcao-dados/:id/edit',
    component: FuncaoDadosPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoDados.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'funcao-dados/:id/delete',
    component: FuncaoDadosDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoDados.home.title'
    },
    outlet: 'popup'
  }
];
