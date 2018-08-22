import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatatableModule} from '@basis/angular-components';
import {MemoryDataTableModule} from '../memory-datatable/memory-datatable.module';
import {BotoesExportacaoModule} from './../botoes-exportacao/botoes-exportacao.module';

import {
    ButtonModule,
    InputTextModule,
    SpinnerModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ConfirmationService,
    DataTableModule,
    DialogModule
} from 'primeng/primeng';

import {
    BaselineService,
    BaselineComponent,
    BaselineViewComponent,
    baselineRoute
} from './';

import {AbacoButtonsModule} from '../abaco-buttons/abaco-buttons.module';
import {StringConcatService} from '../shared/string-concat.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(baselineRoute, {useHash: true}),
        DatatableModule,
        ButtonModule,
        SpinnerModule,
        CalendarModule,
        DropdownModule,
        RadioButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        DataTableModule,
        DialogModule,
        MemoryDataTableModule,
        AbacoButtonsModule,
        BotoesExportacaoModule,
    ],
    declarations: [
        BaselineComponent,
        BaselineViewComponent
    ],
    providers: [
        BaselineService,
        ConfirmationService,
        StringConcatService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoBaselineModule {
}
