import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    AlrService,
    AlrPopupService,
    AlrComponent,
    AlrDetailComponent,
    AlrDialogComponent,
    AlrPopupComponent,
    AlrDeletePopupComponent,
    AlrDeleteDialogComponent,
    alrRoute,
    alrPopupRoute,
} from './';

let ENTITY_STATES = [
    ...alrRoute,
    ...alrPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        AlrComponent,
        AlrDetailComponent,
        AlrDialogComponent,
        AlrDeleteDialogComponent,
        AlrPopupComponent,
        AlrDeletePopupComponent,
    ],
    entryComponents: [
        AlrComponent,
        AlrDialogComponent,
        AlrPopupComponent,
        AlrDeleteDialogComponent,
        AlrDeletePopupComponent,
    ],
    providers: [
        AlrService,
        AlrPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoAlrModule {}
