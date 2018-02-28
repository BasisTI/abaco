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
  DialogModule
} from 'primeng/primeng';

import {
  FuncaoTransacaoFormComponent,
} from './';
import { AbacoAnaliseBotaoSalvarModule } from '../analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoDerTextModule } from '../analise-shared/der-text/der-text.module';

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
    AbacoDerTextModule
  ],
  declarations: [
    FuncaoTransacaoFormComponent
  ],
  exports: [
    FuncaoTransacaoFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFuncaoTransacaoModule {}
