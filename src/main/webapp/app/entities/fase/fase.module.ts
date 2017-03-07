import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    FaseService,
    FasePopupService,
    FaseComponent,
    FaseDetailComponent,
    FaseDialogComponent,
    FasePopupComponent,
    FaseDeletePopupComponent,
    FaseDeleteDialogComponent,
    faseRoute,
    fasePopupRoute,
} from './';

let ENTITY_STATES = [
    ...faseRoute,
    ...fasePopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        FaseComponent,
        FaseDetailComponent,
        FaseDialogComponent,
        FaseDeleteDialogComponent,
        FasePopupComponent,
        FaseDeletePopupComponent,
    ],
    entryComponents: [
        FaseComponent,
        FaseDialogComponent,
        FasePopupComponent,
        FaseDeleteDialogComponent,
        FaseDeletePopupComponent,
    ],
    providers: [
        FaseService,
        FasePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFaseModule {}
