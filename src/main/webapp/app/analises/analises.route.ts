import { Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';

import {
    editRoute
    
} from './';

let ANALISES_ROUTES = [
   editRoute
];

export const analisesState: Routes = [{
    path: '',
    children: ANALISES_ROUTES
}];
