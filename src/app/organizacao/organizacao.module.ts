import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatatableModule } from '@basis/angular-components';
import { MemoryDataTableModule } from '../memory-datatable/memory-datatable.module';
import { BotoesExportacaoModule } from './../botoes-exportacao/botoes-exportacao.module';
import { NgxMaskModule } from 'ngx-mask';
import { UtilModule } from '../util/util.module';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';

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
  DialogModule,
  CheckboxModule,
  FileUploadModule,
} from 'primeng/primeng';

import {
  OrganizacaoService,
  OrganizacaoComponent,
  OrganizacaoDetailComponent,
  OrganizacaoFormComponent,
  organizacaoRoute
} from './';

import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';
import { TextMaskModule } from 'angular2-text-mask';

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
    RouterModule.forRoot(organizacaoRoute, { useHash: true }),
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
    CheckboxModule,
    FileUploadModule,
    NgxMaskModule.forRoot(),
    AbacoButtonsModule,
    TextMaskModule,
    BotoesExportacaoModule,
    UtilModule,
    PanelModule,
    TableModule,
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
    OrganizacaoComponent,
    OrganizacaoDetailComponent,
    OrganizacaoFormComponent,
  ],
  providers: [
    OrganizacaoService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class AbacoOrganizacaoModule { }
