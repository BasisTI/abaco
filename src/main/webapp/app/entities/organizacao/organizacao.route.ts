import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { OrganizacaoComponent } from './organizacao.component';
import { OrganizacaoDetailComponent } from './organizacao-detail.component';
import { OrganizacaoPopupComponent } from './organizacao-dialog.component';
import { OrganizacaoDeletePopupComponent } from './organizacao-delete-dialog.component';

import { Principal } from '../../shared';


export const organizacaoRoute: Routes = [
  {
    path: 'organizacao',
    component: OrganizacaoComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.organizacao.home.title'
    }
  }, {
    path: 'organizacao/:id',
    component: OrganizacaoDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.organizacao.home.title'
    }
  }
];

export const organizacaoPopupRoute: Routes = [
  {
    path: 'organizacao-new',
    component: OrganizacaoPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.organizacao.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'organizacao/:id/edit',
    component: OrganizacaoPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.organizacao.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'organizacao/:id/delete',
    component: OrganizacaoDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.organizacao.home.title'
    },
    outlet: 'popup'
  }
];
