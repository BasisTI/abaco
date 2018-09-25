import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlockUIModule } from 'ng-block-ui';
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
import { AbacoAnaliseBotaoSalvarModule } from '../analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoDerChipsModule } from '../analise-shared/der-chips/der-chips.module';

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
    AbacoDerChipsModule,
    AutoCompleteModule,
    BlockUIModule.forRoot()
  ],
  declarations: [
    FuncaoTransacaoFormComponent
  ],
  exports: [
    FuncaoTransacaoFormComponent
  ],
  providers: [
    ConfirmationService
  ]
})
export class AbacoFuncaoTransacaoModule {}
