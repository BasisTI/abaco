import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    FatorAjusteService,
    FatorAjustePopupService,
    FatorAjusteComponent,
    FatorAjusteDetailComponent,
    FatorAjusteDialogComponent,
    FatorAjustePopupComponent,
    FatorAjusteDeletePopupComponent,
    FatorAjusteDeleteDialogComponent,
    fatorAjusteRoute,
    fatorAjustePopupRoute,
} from './';

let ENTITY_STATES = [
    ...fatorAjusteRoute,
    ...fatorAjustePopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        FatorAjusteComponent,
        FatorAjusteDetailComponent,
        FatorAjusteDialogComponent,
        FatorAjusteDeleteDialogComponent,
        FatorAjustePopupComponent,
        FatorAjusteDeletePopupComponent,
    ],
    entryComponents: [
        FatorAjusteComponent,
        FatorAjusteDialogComponent,
        FatorAjustePopupComponent,
        FatorAjusteDeleteDialogComponent,
        FatorAjusteDeletePopupComponent,
    ],
    providers: [
        FatorAjusteService,
        FatorAjustePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFatorAjusteModule {}
