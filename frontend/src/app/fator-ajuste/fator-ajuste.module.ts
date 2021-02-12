import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableModule } from '@nuvem/primeng-components';
import { ConfirmDialogModule } from 'primeng';
import { SharedModule } from '../shared/shared.module';
import {
  FatorAjusteDetailComponent,
  FatorAjusteFormComponent,
  FatorAjusteListComponent,
  fatorAjusteRoute, FatorAjusteService
} from './';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(fatorAjusteRoute, { useHash: true }),
    DatatableModule,
    ConfirmDialogModule,
    SharedModule
  ],
  declarations: [
    FatorAjusteListComponent,
    FatorAjusteDetailComponent,
    FatorAjusteFormComponent
  ],
  providers: [
    FatorAjusteService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FatorAjusteModule {}
