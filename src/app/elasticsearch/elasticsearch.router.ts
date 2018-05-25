import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { ElasticSearchComponent } from './elasticsearch.component';

export const elasticsearchRoute: Routes = [
  {
    path: 'elasticsearch',
    component: ElasticSearchComponent
  },
];
