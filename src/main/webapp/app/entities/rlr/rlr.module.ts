import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    RlrService,
    RlrPopupService,
    RlrComponent,
    RlrDetailComponent,
    RlrDialogComponent,
    RlrPopupComponent,
    RlrDeletePopupComponent,
    RlrDeleteDialogComponent,
    rlrRoute,
    rlrPopupRoute,
} from './';

let ENTITY_STATES = [
    ...rlrRoute,
    ...rlrPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        RlrComponent,
        RlrDetailComponent,
        RlrDialogComponent,
        RlrDeleteDialogComponent,
        RlrPopupComponent,
        RlrDeletePopupComponent,
    ],
    entryComponents: [
        RlrComponent,
        RlrDialogComponent,
        RlrPopupComponent,
        RlrDeleteDialogComponent,
        RlrDeletePopupComponent,
    ],
    providers: [
        RlrService,
        RlrPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoRlrModule {}
