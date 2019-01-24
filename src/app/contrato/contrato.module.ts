import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatatableModule } from '@basis/angular-components';
import {
  ButtonModule,
  InputTextModule,
  SpinnerModule,
  CalendarModule,
  DropdownModule,
  RadioButtonModule,
  ConfirmDialogModule,
  ConfirmationService
} from 'primeng/primeng';

import {
  ContratoService,
  ContratoComponent,
  ContratoDetailComponent,
  ContratoFormComponent,
  contratoRoute
} from './';
import { GenericService } from '../util/service/generic.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(contratoRoute, { useHash: true }),
    DatatableModule,
    ButtonModule,
    SpinnerModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    InputTextModule,
    ConfirmDialogModule,
  ],
  declarations: [
    ContratoComponent,
    ContratoDetailComponent,
    ContratoFormComponent
  ],
  providers: [
    ContratoService,
    ConfirmationService,
    GenericService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoContratoModule {}
