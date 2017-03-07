import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    FuncionalidadeService,
    FuncionalidadePopupService,
    FuncionalidadeComponent,
    FuncionalidadeDetailComponent,
    FuncionalidadeDialogComponent,
    FuncionalidadePopupComponent,
    FuncionalidadeDeletePopupComponent,
    FuncionalidadeDeleteDialogComponent,
    funcionalidadeRoute,
    funcionalidadePopupRoute,
} from './';

let ENTITY_STATES = [
    ...funcionalidadeRoute,
    ...funcionalidadePopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        FuncionalidadeComponent,
        FuncionalidadeDetailComponent,
        FuncionalidadeDialogComponent,
        FuncionalidadeDeleteDialogComponent,
        FuncionalidadePopupComponent,
        FuncionalidadeDeletePopupComponent,
    ],
    entryComponents: [
        FuncionalidadeComponent,
        FuncionalidadeDialogComponent,
        FuncionalidadePopupComponent,
        FuncionalidadeDeleteDialogComponent,
        FuncionalidadeDeletePopupComponent,
    ],
    providers: [
        FuncionalidadeService,
        FuncionalidadePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFuncionalidadeModule {}
