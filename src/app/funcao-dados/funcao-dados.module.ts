import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuncaoDadosFormComponent } from './funcao-dados-form.component';
import { DatatableModule } from '@basis/angular-components';
import {SecurityModule} from '@basis/angular-components';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

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
  DialogModule,
  MultiSelectModule,
  AutoCompleteModule
} from 'primeng/primeng';

import { AbacoSharedModule } from '../shared/abaco-shared.module';
import { AbacoAnaliseSharedModule } from '../analise-shared/analise-shared.module';
import { MemoryDataTableModule } from '../memory-datatable/memory-datatable.module';
import { AbacoAnaliseBotaoSalvarModule } from '../analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoEllipsisTooltipModule } from '../shared/ellipsis-tooltip/ellipsis-tooltip.module';
import { AbacoDerChipsModule } from '../analise-shared/der-chips/der-chips.module';
import { AbacoDerTextModule } from '../analise-shared/der-text/der-text.module';
import { FuncaoDadosService } from './funcao-dados.service';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

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
    AbacoAnaliseSharedModule,
    MemoryDataTableModule,
    AbacoAnaliseBotaoSalvarModule,
    AbacoEllipsisTooltipModule,
    MultiSelectModule,
    AbacoDerChipsModule,
    AutoCompleteModule,
    CKEditorModule,
    SecurityModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    FuncaoDadosFormComponent
  ],
  exports: [
    FuncaoDadosFormComponent
  ],
  providers: [
    FuncaoDadosService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFuncaoDadosModule { }
