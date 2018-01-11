import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
    ButtonModule,
    InputTextModule,
    SpinnerModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ConfirmationService,
    PasswordModule
} from 'primeng/primeng';

import { LoginComponent, loginRoute, LoginService } from './';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(loginRoute, { useHash: true }),
        ButtonModule,
        ButtonModule,
        SpinnerModule,
        CalendarModule,
        DropdownModule,
        RadioButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        PasswordModule
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        LoginService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LoginModule {

}
