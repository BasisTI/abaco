import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    AnaliseService,
    AnalisePopupService,
    AnaliseComponent,
    AnaliseDetailComponent,
    AnaliseDialogComponent,
    AnalisePopupComponent,
    AnaliseDeletePopupComponent,
    AnaliseDeleteDialogComponent,
    analiseRoute,
    analisePopupRoute,
} from './';

let ENTITY_STATES = [
    ...analiseRoute,
    ...analisePopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        AnaliseComponent,
        AnaliseDetailComponent,
        AnaliseDialogComponent,
        AnaliseDeleteDialogComponent,
        AnalisePopupComponent,
        AnaliseDeletePopupComponent,
    ],
    entryComponents: [
        AnaliseComponent,
        AnaliseDialogComponent,
        AnalisePopupComponent,
        AnaliseDeleteDialogComponent,
        AnaliseDeletePopupComponent,
    ],
    providers: [
        AnaliseService,
        AnalisePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoAnaliseModule {}
