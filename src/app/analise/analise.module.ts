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
import { FatorAjusteToSelectItemPipe } from '../shared/index';
import { AbacoFuncaoDadosModule } from '../funcao-dados/funcao-dados.module';

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
    AbacoFuncaoDadosModule
  ],
  declarations: [
    AnaliseComponent,
    AnaliseDetailComponent,
    AnaliseFormComponent,
    FatorAjusteToSelectItemPipe
  ],
  providers: [
    AnaliseService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoAnaliseModule {}
