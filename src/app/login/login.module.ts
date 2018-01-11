import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, TooltipModule } from 'primeng/primeng';
import { RouterModule } from '@angular/router';
import { LoginComponent, loginRoute } from './index';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
        RouterModule.forRoot(loginRoute, { useHash: true }),
    ],
    declarations: [
        LoginComponent
    ],
    exports: [
        LoginComponent
    ]
})

export class LoginModule {

}
