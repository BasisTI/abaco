import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from '../shared/shared.module';
import {
  SistemaDetailComponent,
  SistemaFormComponent, SistemaListComponent,


  sistemaRoute, SistemaService
} from '.';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(sistemaRoute, { useHash: true }),
    DatatableModule,
    DatatableModule,
    SharedModule,
    AbacoButtonsModule,
  ],
  declarations: [
    SistemaListComponent,
    SistemaDetailComponent,
    SistemaFormComponent,
  ],
  providers: [
    SistemaService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SistemaModule {}
