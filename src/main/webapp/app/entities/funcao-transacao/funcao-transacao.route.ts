import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { FuncaoTransacaoComponent } from './funcao-transacao.component';
import { FuncaoTransacaoDetailComponent } from './funcao-transacao-detail.component';
import { FuncaoTransacaoPopupComponent } from './funcao-transacao-dialog.component';
import { FuncaoTransacaoDeletePopupComponent } from './funcao-transacao-delete-dialog.component';

import { Principal } from '../../shared';


export const funcaoTransacaoRoute: Routes = [
  {
    path: 'funcao-transacao',
    component: FuncaoTransacaoComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoTransacao.home.title'
    }
  }, {
    path: 'funcao-transacao/:id',
    component: FuncaoTransacaoDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoTransacao.home.title'
    }
  }
];

export const funcaoTransacaoPopupRoute: Routes = [
  {
    path: 'funcao-transacao-new',
    component: FuncaoTransacaoPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoTransacao.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'funcao-transacao/:id/edit',
    component: FuncaoTransacaoPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoTransacao.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'funcao-transacao/:id/delete',
    component: FuncaoTransacaoDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.funcaoTransacao.home.title'
    },
    outlet: 'popup'
  }
];
