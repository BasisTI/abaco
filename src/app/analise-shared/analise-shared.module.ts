import { FieldsetModule } from 'primeng/fieldset';
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
import { FuncaoResumoTableComponent } from './funcao-resumo-table.component';

import {HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


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
        DialogModule,
        FieldsetModule,
        TranslateModule.forChild({
            loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        ModuloFuncionalidadeComponent,
        FuncaoResumoTableComponent
    ],
    exports: [
        ModuloFuncionalidadeComponent,
        FuncaoResumoTableComponent
    ]
})
export class AbacoAnaliseSharedModule { }
