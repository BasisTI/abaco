import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    ContratoService,
    ContratoPopupService,
    ContratoComponent,
    ContratoDetailComponent,
    ContratoDialogComponent,
    ContratoPopupComponent,
    ContratoDeletePopupComponent,
    ContratoDeleteDialogComponent,
    contratoRoute,
    contratoPopupRoute,
} from './';

let ENTITY_STATES = [
    ...contratoRoute,
    ...contratoPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ContratoComponent,
        ContratoDetailComponent,
        ContratoDialogComponent,
        ContratoDeleteDialogComponent,
        ContratoPopupComponent,
        ContratoDeletePopupComponent,
    ],
    entryComponents: [
        ContratoComponent,
        ContratoDialogComponent,
        ContratoPopupComponent,
        ContratoDeleteDialogComponent,
        ContratoDeletePopupComponent,
    ],
    providers: [
        ContratoService,
        ContratoPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoContratoModule {}
