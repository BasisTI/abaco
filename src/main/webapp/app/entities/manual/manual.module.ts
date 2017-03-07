import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    ManualService,
    ManualPopupService,
    ManualComponent,
    ManualDetailComponent,
    ManualDialogComponent,
    ManualPopupComponent,
    ManualDeletePopupComponent,
    ManualDeleteDialogComponent,
    manualRoute,
    manualPopupRoute,
} from './';

let ENTITY_STATES = [
    ...manualRoute,
    ...manualPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ManualComponent,
        ManualDetailComponent,
        ManualDialogComponent,
        ManualDeleteDialogComponent,
        ManualPopupComponent,
        ManualDeletePopupComponent,
    ],
    entryComponents: [
        ManualComponent,
        ManualDialogComponent,
        ManualPopupComponent,
        ManualDeleteDialogComponent,
        ManualDeletePopupComponent,
    ],
    providers: [
        ManualService,
        ManualPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoManualModule {}
