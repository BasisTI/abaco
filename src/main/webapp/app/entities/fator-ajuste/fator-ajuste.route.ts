import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { FatorAjusteComponent } from './fator-ajuste.component';
import { FatorAjusteDetailComponent } from './fator-ajuste-detail.component';
import { FatorAjustePopupComponent } from './fator-ajuste-dialog.component';
import { FatorAjusteDeletePopupComponent } from './fator-ajuste-delete-dialog.component';

import { Principal } from '../../shared';


export const fatorAjusteRoute: Routes = [
  {
    path: 'fator-ajuste',
    component: FatorAjusteComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fatorAjuste.home.title'
    }
  }, {
    path: 'fator-ajuste/:id',
    component: FatorAjusteDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fatorAjuste.home.title'
    }
  }
];

export const fatorAjustePopupRoute: Routes = [
  {
    path: 'fator-ajuste-new',
    component: FatorAjustePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fatorAjuste.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'fator-ajuste/:id/edit',
    component: FatorAjustePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fatorAjuste.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'fator-ajuste/:id/delete',
    component: FatorAjusteDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'abacoApp.fatorAjuste.home.title'
    },
    outlet: 'popup'
  }
];
