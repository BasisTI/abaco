import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatatableModule } from '@basis/angular-components';

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
  InputTextareaModule
} from 'primeng/primeng';

import {
  AnaliseService,
  AnaliseComponent,
  AnaliseDetailComponent,
  AnaliseFormComponent,
  analiseRoute
} from './';

import { AbacoFuncaoDadosModule } from '../funcao-dados/funcao-dados.module';
import { AbacoSharedModule } from '../shared/abaco-shared.module';
import { AbacoFuncaoTransacaoModule } from '../funcao-transacao/funcao-transacao.module';
import { AbacoAnaliseResumoModule } from './resumo/analise-resumo.module';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(analiseRoute, { useHash: true }),
    DatatableModule,
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
    AbacoFuncaoDadosModule,
    AbacoSharedModule,
    AbacoFuncaoTransacaoModule,
    AbacoAnaliseResumoModule
  ],
  declarations: [
    AnaliseComponent,
    AnaliseDetailComponent,
    AnaliseFormComponent,
  ],
  providers: [
    AnaliseService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoAnaliseModule {}
