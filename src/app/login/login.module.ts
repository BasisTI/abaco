import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SecurityModule, AuthorizationService } from '@nuvem/angular-base';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent, loginRoute, LoginService } from './';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot(loginRoute, { useHash: true }),
        SharedModule,
        SecurityModule,
        
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        LoginService,
        AuthorizationService,
        // CookieService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LoginModule {

}
