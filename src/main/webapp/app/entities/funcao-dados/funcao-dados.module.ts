import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    FuncaoDadosService,
    FuncaoDadosPopupService,
    FuncaoDadosComponent,
    FuncaoDadosDetailComponent,
    FuncaoDadosDialogComponent,
    FuncaoDadosPopupComponent,
    FuncaoDadosDeletePopupComponent,
    FuncaoDadosDeleteDialogComponent,
    funcaoDadosRoute,
    funcaoDadosPopupRoute,
} from './';

let ENTITY_STATES = [
    ...funcaoDadosRoute,
    ...funcaoDadosPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        FuncaoDadosComponent,
        FuncaoDadosDetailComponent,
        FuncaoDadosDialogComponent,
        FuncaoDadosDeleteDialogComponent,
        FuncaoDadosPopupComponent,
        FuncaoDadosDeletePopupComponent,
    ],
    entryComponents: [
        FuncaoDadosComponent,
        FuncaoDadosDialogComponent,
        FuncaoDadosPopupComponent,
        FuncaoDadosDeleteDialogComponent,
        FuncaoDadosDeletePopupComponent,
    ],
    providers: [
        FuncaoDadosService,
        FuncaoDadosPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFuncaoDadosModule {}
