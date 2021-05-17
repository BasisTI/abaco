import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityModule } from '@nuvem/angular-base';
import { DatatableModule } from '@nuvem/primeng-components';

import { RouterModule } from '@angular/router';


import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToggleButtonModule, DropdownModule, ChartModule, InputNumberModule, CardModule, MessageModule, MessagesModule } from 'primeng';

import { VisaoPfListModelsService } from './visao-pf-list-models.service';
import { VisaopfListModelsComponent } from './visao-pf-list-models.component';
import { visaopfListModelsRoute } from './visao-pf-list-models.route';

@NgModule({
    imports: [
        RouterModule.forRoot(visaopfListModelsRoute, {useHash: true}),
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
        CardModule,
        MessageModule,
        MessagesModule
    ],
  declarations: [
    VisaopfListModelsComponent,
  ],
  exports: [
    VisaopfListModelsComponent,
  ],
  providers: [
    VisaoPfListModelsService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisaopfListsModelsModule { }
