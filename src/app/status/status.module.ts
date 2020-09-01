import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  StatusService,
  StatusListComponent,
  StatusDetailComponent,
  StatusFormComponent,
  statusRoute,
} from './';

import { HttpClientModule } from '@angular/common/http';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from '../shared/shared.module';
import { AdminGuard } from '../util/admin.guard';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { CheckboxModule } from 'primeng';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(statusRoute, { useHash: true }),
    DatatableModule,
    AbacoButtonsModule,
    SharedModule,
    CheckboxModule,
  ],
  declarations: [
    StatusListComponent,
    StatusDetailComponent,
    StatusFormComponent
  ],
  providers: [
    StatusService,
    AdminGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StatusModule { }
