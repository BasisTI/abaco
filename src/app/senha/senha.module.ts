import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SenhaComponent, SenhaFormComponent, senhaRoute, SenhaService } from './';
import { HttpClientModule } from '@angular/common/http';
import { SecurityModule } from '@nuvem/angular-base';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot(senhaRoute, { useHash: true }),
        SharedModule,
        SecurityModule,
    ],
    declarations: [
        SenhaFormComponent,
        SenhaComponent
    ],
    providers: [
        SenhaService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SenhaModule {}