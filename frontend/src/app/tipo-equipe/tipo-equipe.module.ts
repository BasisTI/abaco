import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


import {
  TipoEquipeService,
  TipoEquipeListComponent,
  TipoEquipeDetailComponent,
  TipoEquipeFormComponent,
  tipoEquipeRoute
} from './';


import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { AdminGuard } from '../util/admin.guard';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(tipoEquipeRoute, { useHash: true }),
    DatatableModule,
    AbacoButtonsModule,
    SharedModule,
  ],
  declarations: [
    TipoEquipeListComponent,
    TipoEquipeDetailComponent,
    TipoEquipeFormComponent
  ],
  providers: [
    TipoEquipeService,
    AdminGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TipoEquipeModule {}
