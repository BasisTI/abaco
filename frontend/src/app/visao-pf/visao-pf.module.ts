import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityModule } from '@nuvem/angular-base';
import { DatatableModule } from '@nuvem/primeng-components';

import { RouterModule } from '@angular/router';
import { visaopfRoute } from './visao-pf.route';
import { VisaoPfService } from './visao-pf.service';
import { VisaoPfComponent } from './visao-pf.component';
import { CanvasVisaopfComponent } from './canvas-visaopf/canvas-visaopf.component';
import { CanvasVisaopfTooltipDirective } from './canvas-visaopf/canvas-visaopf-tooltip.directive';

import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToggleButtonModule, DropdownModule } from 'primeng';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
    imports: [
        RouterModule.forRoot(visaopfRoute, {useHash: true}),
        CommonModule,
        HttpClientModule,
        FormsModule,
        SecurityModule,
        DatatableModule,
        ReactiveFormsModule,
        FieldsetModule,
        ButtonModule,
        FileUploadModule,
        TableModule,
        DialogModule,
        InputTextModule,
        InputTextareaModule,
        ToggleButtonModule,
        DropdownModule,
        PaginatorModule,
    ],
  declarations: [
    VisaoPfComponent,
    CanvasVisaopfTooltipDirective,
    CanvasVisaopfComponent
  ],
  exports: [
    VisaoPfComponent,
  ],
  providers: [
    VisaoPfService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisaopfModule { }
