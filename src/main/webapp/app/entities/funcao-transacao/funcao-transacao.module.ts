import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    FuncaoTransacaoService,
    FuncaoTransacaoPopupService,
    FuncaoTransacaoComponent,
    FuncaoTransacaoDetailComponent,
    FuncaoTransacaoDialogComponent,
    FuncaoTransacaoPopupComponent,
    FuncaoTransacaoDeletePopupComponent,
    FuncaoTransacaoDeleteDialogComponent,
    funcaoTransacaoRoute,
    funcaoTransacaoPopupRoute,
} from './';

let ENTITY_STATES = [
    ...funcaoTransacaoRoute,
    ...funcaoTransacaoPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        FuncaoTransacaoComponent,
        FuncaoTransacaoDetailComponent,
        FuncaoTransacaoDialogComponent,
        FuncaoTransacaoDeleteDialogComponent,
        FuncaoTransacaoPopupComponent,
        FuncaoTransacaoDeletePopupComponent,
    ],
    entryComponents: [
        FuncaoTransacaoComponent,
        FuncaoTransacaoDialogComponent,
        FuncaoTransacaoPopupComponent,
        FuncaoTransacaoDeleteDialogComponent,
        FuncaoTransacaoDeletePopupComponent,
    ],
    providers: [
        FuncaoTransacaoService,
        FuncaoTransacaoPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFuncaoTransacaoModule {}
