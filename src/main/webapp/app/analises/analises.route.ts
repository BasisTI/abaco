import { Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';

import {
    editRoute

} from './';
import {moduloPopupRoute, moduloRoute} from "../entities/modulo/modulo.route";
import {funcionalidadePopupRoute, funcionalidadeRoute} from "../entities/funcionalidade/funcionalidade.route";

let ANALISES_ROUTES = [
   editRoute,
    ...moduloRoute,
    ...moduloPopupRoute,
    ...funcionalidadeRoute,
    ...funcionalidadePopupRoute,
];

export const analisesState: Routes = [{
    path: '',
    children: ANALISES_ROUTES
}];
