import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';
import { ModuloComponent } from '../modulo';

import {
    SistemaService,
    SistemaPopupService,
    SistemaComponent,
    SistemaDetailComponent,
    SistemaDialogComponent,
    SistemaPopupComponent,
    SistemaDeletePopupComponent,
    SistemaDeleteDialogComponent,
    sistemaRoute,
    sistemaPopupRoute,
} from './';

let ENTITY_STATES = [
    ...sistemaRoute,
    ...sistemaPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ModuloComponent,
        SistemaComponent,
        SistemaDetailComponent,
        SistemaDialogComponent,
        SistemaDeleteDialogComponent,
        SistemaPopupComponent,
        SistemaDeletePopupComponent,
    ],
    entryComponents: [
        SistemaComponent,
        SistemaDialogComponent,
        SistemaPopupComponent,
        SistemaDeleteDialogComponent,
        SistemaDeletePopupComponent,
    ],
    providers: [
        SistemaService,
        SistemaPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoSistemaModule {}
