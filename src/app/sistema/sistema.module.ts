import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatatableModule } from '@basis/angular-components';
import { MemoryDataTableModule } from '../memory-datatable/memory-datatable.module';
import { BotoesExportacaoModule } from './../botoes-exportacao/botoes-exportacao.module';

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
  SistemaService,
  SistemaComponent,
  SistemaDetailComponent,
  SistemaFormComponent,
  sistemaRoute
} from './';

import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';
import { StringConcatService } from '../shared/string-concat.service';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(sistemaRoute, { useHash: true }),
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
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    SistemaComponent,
    SistemaDetailComponent,
    SistemaFormComponent,
  ],
  providers: [
    SistemaService,
    ConfirmationService,
    StringConcatService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoSistemaModule {}
