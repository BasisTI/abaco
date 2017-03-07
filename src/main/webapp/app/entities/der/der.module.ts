import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    DerService,
    DerPopupService,
    DerComponent,
    DerDetailComponent,
    DerDialogComponent,
    DerPopupComponent,
    DerDeletePopupComponent,
    DerDeleteDialogComponent,
    derRoute,
    derPopupRoute,
} from './';

let ENTITY_STATES = [
    ...derRoute,
    ...derPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        DerComponent,
        DerDetailComponent,
        DerDialogComponent,
        DerDeleteDialogComponent,
        DerPopupComponent,
        DerDeletePopupComponent,
    ],
    entryComponents: [
        DerComponent,
        DerDialogComponent,
        DerPopupComponent,
        DerDeleteDialogComponent,
        DerDeletePopupComponent,
    ],
    providers: [
        DerService,
        DerPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoDerModule {}
