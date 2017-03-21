import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../../shared';

import {
    OrganizacaoService,
    OrganizacaoPopupService,
    OrganizacaoComponent,
    OrganizacaoDetailComponent,
    OrganizacaoDialogComponent,
    OrganizacaoPopupComponent,
    OrganizacaoDeletePopupComponent,
    OrganizacaoDeleteDialogComponent,
    organizacaoRoute,
    organizacaoPopupRoute,
} from './';

let ENTITY_STATES = [
    ...organizacaoRoute,
    ...organizacaoPopupRoute,
];

@NgModule({
    imports: [
        AbacoSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true }),
        FormsModule,
        TextMaskModule
    ],
    declarations: [
        OrganizacaoComponent,
        OrganizacaoDetailComponent,
        OrganizacaoDialogComponent,
        OrganizacaoDeleteDialogComponent,
        OrganizacaoPopupComponent,
        OrganizacaoDeletePopupComponent,
    ],
    entryComponents: [
        OrganizacaoComponent,
        OrganizacaoDialogComponent,
        OrganizacaoPopupComponent,
        OrganizacaoDeleteDialogComponent,
        OrganizacaoDeletePopupComponent,
    ],
    providers: [
        OrganizacaoService,
        OrganizacaoPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoOrganizacaoModule {}
