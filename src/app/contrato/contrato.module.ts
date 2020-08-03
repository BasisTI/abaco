import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  ContratoService,
  ContratoDetailComponent,
  ContratoFormComponent,
  contratoRoute
} from './';

import { SharedModule } from '../shared/shared.module';
import { ContratoListComponent } from './contrato-list/contrato-list.component';
import { DatatableModule } from '@nuvem/primeng-components';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(contratoRoute, { useHash: true }),
    DatatableModule,
    SharedModule,
  ],
  declarations: [
    ContratoListComponent,
    ContratoDetailComponent,
    ContratoFormComponent
  ],
  providers: [
    ContratoService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContratoModule {}
