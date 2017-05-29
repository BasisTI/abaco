import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbacoSharedModule } from '../shared';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DataTableModule } from "angular2-datatable";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';

import {
    AnalisEditComponent,
    analisesState

} from './';

@NgModule({
    imports: [
        AbacoSharedModule,
        DataTableModule,
        ReactiveFormsModule,
        TabsModule.forRoot(),
        RouterModule.forRoot(analisesState, { useHash: true })
    ],
    declarations: [
        AnalisEditComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoAnalisesModule {}
