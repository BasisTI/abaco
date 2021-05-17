import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityModule } from '@nuvem/angular-base';
import { DatatableModule } from '@nuvem/primeng-components';
import { RouterModule } from '@angular/router';
import { visaopfExportModelRoute } from './visao-pf-export-model.route';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule, DropdownModule, ChartModule, InputNumberModule, CardModule, MessageModule, MessagesModule } from 'primeng';
import { VisaoPfExportModelComponent } from './visao-pf-export-model.component';
import { VisaoPfExportModelService } from './visao-pf-export-model.service';


@NgModule({
    imports: [
        RouterModule.forRoot(visaopfExportModelRoute, {useHash: true}),
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
        MessagesModule,
        ToastModule
    ],
  declarations: [
    VisaoPfExportModelComponent,
  ],
  exports: [
    VisaoPfExportModelComponent,
  ],
  providers: [
    VisaoPfExportModelService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisaopfExportModelModule { }
