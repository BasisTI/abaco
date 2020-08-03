import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FieldsetModule } from 'primeng/fieldset';
import { SharedModule } from '../shared/shared.module';
import {
  OrganizacaoListComponent,
  OrganizacaoDetailComponent,
  OrganizacaoFormComponent,
  organizacaoRoute, OrganizacaoService
} from './';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { DatatableModule } from '@nuvem/primeng-components';




@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(organizacaoRoute, { useHash: true }),
    AbacoButtonsModule,
    DatatableModule,
    FieldsetModule,
    SharedModule,
  ],
  declarations: [
    OrganizacaoListComponent,
    OrganizacaoDetailComponent,
    OrganizacaoFormComponent,
  ],
  providers: [
    OrganizacaoService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class OrganizacaoModule { }
