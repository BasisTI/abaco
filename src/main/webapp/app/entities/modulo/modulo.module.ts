import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    ModuloService,
    ModuloPopupService,
    ModuloComponent,
    ModuloDetailComponent,
    ModuloDialogComponent,
    ModuloPopupComponent,
    ModuloDeletePopupComponent,
    ModuloDeleteDialogComponent,
    moduloRoute,
    moduloPopupRoute,
} from './';

let ENTITY_STATES = [
    ...moduloRoute,
    ...moduloPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ModuloComponent,
        ModuloDetailComponent,
        ModuloDialogComponent,
        ModuloDeleteDialogComponent,
        ModuloPopupComponent,
        ModuloDeletePopupComponent,
    ],
    entryComponents: [
        ModuloComponent,
        ModuloDialogComponent,
        ModuloPopupComponent,
        ModuloDeleteDialogComponent,
        ModuloDeletePopupComponent,
    ],
    providers: [
        ModuloService,
        ModuloPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoModuloModule {}
