import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  UserService,
  UserListComponent,
  UserDetailComponent,
  UserFormComponent,
  userRoute
} from './';


import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { DatatableModule } from '@nuvem/primeng-components';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(userRoute, { useHash: true }),
    DatatableModule,
    DatatableModule,
    AbacoButtonsModule,
    SharedModule,
  ],
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserFormComponent
  ],
  providers: [
    UserService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserModule {}
