import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';

import {
    ButtonModule,
    InputTextModule,
    SpinnerModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DataTableModule,
    ConfirmationService,
    TabViewModule,
    InputTextareaModule,
    DialogModule
} from 'primeng/primeng';

import { AbacoSharedModule } from '../shared/abaco-shared.module';
import { ModuloFuncionalidadeComponent } from './modulo-funcionalidade.component';
import { DerTextComponent } from './der-text-component';
import { FuncaoResumoTableComponent } from './funcao-resumo-table.component';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ButtonModule,
        SpinnerModule,
        CalendarModule,
        DropdownModule,
        RadioButtonModule,
        InputTextModule,
        DataTableModule,
        ConfirmDialogModule,
        AbacoButtonsModule,
        TabViewModule,
        InputTextareaModule,
        AbacoSharedModule,
        DialogModule
    ],
    declarations: [
        ModuloFuncionalidadeComponent,
        DerTextComponent,
        FuncaoResumoTableComponent
    ],
    exports: [
        ModuloFuncionalidadeComponent,
        DerTextComponent,
        FuncaoResumoTableComponent
    ]
})
export class AbacoAnaliseSharedModule { }
