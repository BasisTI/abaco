import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    EsforcoFaseService,
    EsforcoFasePopupService,
    EsforcoFaseComponent,
    EsforcoFaseDetailComponent,
    EsforcoFaseDialogComponent,
    EsforcoFasePopupComponent,
    EsforcoFaseDeletePopupComponent,
    EsforcoFaseDeleteDialogComponent,
    esforcoFaseRoute,
    esforcoFasePopupRoute,
} from './';

let ENTITY_STATES = [
    ...esforcoFaseRoute,
    ...esforcoFasePopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        EsforcoFaseComponent,
        EsforcoFaseDetailComponent,
        EsforcoFaseDialogComponent,
        EsforcoFaseDeleteDialogComponent,
        EsforcoFasePopupComponent,
        EsforcoFaseDeletePopupComponent,
    ],
    entryComponents: [
        EsforcoFaseComponent,
        EsforcoFaseDialogComponent,
        EsforcoFasePopupComponent,
        EsforcoFaseDeleteDialogComponent,
        EsforcoFaseDeletePopupComponent,
    ],
    providers: [
        EsforcoFaseService,
        EsforcoFasePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoEsforcoFaseModule {}
