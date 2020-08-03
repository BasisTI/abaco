import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  ModuloService,
  ModuloListComponent,
} from './';

import { HttpClientModule } from '@angular/common/http';
import { DatatableModule } from '@nuvem/primeng-components';
import { ModuloDetailComponent } from './modulo-detail/modulo-detail.component';
import { ModuloFormComponent } from './modulo-form/modulo-form.component';
import { moduloRoute } from './modulo.route';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(moduloRoute, { useHash: true }),
    DatatableModule,
    SharedModule,
  ],
  declarations: [
    ModuloListComponent,
    ModuloDetailComponent,
    ModuloFormComponent,
  ],
  providers: [
    ModuloService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModuloModule {}
