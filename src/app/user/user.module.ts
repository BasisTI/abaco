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
  DataTableModule,
  ConfirmationService,
  MultiSelectModule
} from 'primeng/primeng';

import {
  UserService,
  UserComponent,
  UserDetailComponent,
  UserFormComponent,
  userRoute
} from './';
import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';

import { StringConcatService } from '../shared/string-concat.service';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot(userRoute, { useHash: true }),
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
    MultiSelectModule
  ],
  declarations: [
    UserComponent,
    UserDetailComponent,
    UserFormComponent
  ],
  providers: [
    UserService,
    ConfirmationService,
    StringConcatService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoUserModule {}
