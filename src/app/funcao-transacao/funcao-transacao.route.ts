import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { FuncaoTransacaoComponent } from './funcao-transacao.component';
import { FuncaoTransacaoDetailComponent } from './funcao-transacao-detail.component';
import { FuncaoTransacaoFormComponent } from './funcao-transacao-form.component';

export const funcaoTransacaoRoute: Routes = [
  {
    path: 'funcaoTransacao',
    component: FuncaoTransacaoComponent
  },
  {
    path: 'funcaoTransacao/new',
    component: FuncaoTransacaoFormComponent
  },
  {
    path: 'funcaoTransacao/:id/edit',
    component: FuncaoTransacaoFormComponent
  },
  {
    path: 'funcaoTransacao/:id',
    component: FuncaoTransacaoDetailComponent
  },
];
