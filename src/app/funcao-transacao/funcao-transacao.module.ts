import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatatableModule } from '@basis/angular-components';
import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';
import { AbacoSharedModule } from '../shared/abaco-shared.module';
import { AbacoAnaliseSharedModule } from '../analise-shared/analise-shared.module';
import { MemoryDataTableModule } from '../memory-datatable/memory-datatable.module';
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
  AutoCompleteModule
} from 'primeng/primeng';

import {
  FuncaoTransacaoFormComponent,
} from './';
import { PesquisarFtRoutes } from './funcao-transacao-form.route';
import { AbacoAnaliseBotaoSalvarModule } from '../analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoDerChipsModule } from '../analise-shared/der-chips/der-chips.module';
import { FuncaoTransacaoService } from './funcao-transacao.service';
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
    RouterModule.forChild(PesquisarFtRoutes),
    AbacoSharedModule,
    DialogModule,
    AbacoAnaliseSharedModule,
    MemoryDataTableModule,
    AbacoAnaliseBotaoSalvarModule,
    AbacoDerChipsModule,
    AutoCompleteModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    FuncaoTransacaoFormComponent
  ],
  exports: [
    FuncaoTransacaoFormComponent
  ],
  providers: [
    ConfirmationService,
    FuncaoTransacaoService
  ]
})
export class AbacoFuncaoTransacaoModule {}
