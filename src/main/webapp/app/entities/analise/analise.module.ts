import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap';
import { AbacoSharedModule } from '../../shared';
import { DataTableModule } from "angular2-datatable";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Ng2UploaderModule } from 'ng2-uploader';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';


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
        TabsModule.forRoot(),
        DataTableModule,
        Ng2Bs3ModalModule,
        Ng2UploaderModule,
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
