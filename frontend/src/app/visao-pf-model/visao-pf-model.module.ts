import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityModule } from '@nuvem/angular-base';
import { DatatableModule } from '@nuvem/primeng-components';

import { RouterModule } from '@angular/router';
import { visaopfModelRoute } from './visao-pf-model.route';

import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToggleButtonModule, DropdownModule, ChartModule, InputNumberModule, CardModule, MessageModule, MessagesModule } from 'primeng';

import { VisaoPfModelComponent } from './visao-pf-model.component';
import { VisaoPfModelService } from './visao-pf-model.service';


@NgModule({
    imports: [
        RouterModule.forRoot(visaopfModelRoute, {useHash: true}),
        CommonModule,
        HttpClientModule,
        FormsModule,
        SecurityModule,
        DatatableModule,
        ReactiveFormsModule,
        FieldsetModule,
        ButtonModule,
        TableModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        ToggleButtonModule,
        DropdownModule,
        ChartModule,
        InputNumberModule,
        CardModule,
        MessageModule,
        MessagesModule
    ],
  declarations: [
    VisaoPfModelComponent,
  ],
  exports: [
    VisaoPfModelComponent,
  ],
  providers: [
    VisaoPfModelService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisaopfModelModule { }
