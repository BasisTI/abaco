import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatatableModule } from '@basis/angular-components';
import { MemoryDataTableModule } from '../memory-datatable/memory-datatable.module';
import { BotoesExportacaoModule } from './../botoes-exportacao/botoes-exportacao.module';

import {
    ButtonModule,
    InputTextModule,
    SpinnerModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ConfirmationService,
    DataTableModule,
    DialogModule
} from 'primeng/primeng';

import {
    BaselineService,
    BaselineComponent,
    BaselineViewComponent,
    baselineRoute,
    BaselineFuncaoDadosComponent,
    BaselineFuncaoTransacaoComponent,
    BaselineInfSistemaComponent
} from './';

import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';
import { StringConcatService } from '../shared/string-concat.service';
import { BaselineComplexidadeComponent } from './analitico/complexidade/baseline-complexidade.component';
import { BaselineImpactoComponent } from './analitico/impacto/baseline-impacto.component';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(baselineRoute, { useHash: true }),
        DatatableModule,
        ButtonModule,
        SpinnerModule,
        CalendarModule,
        DropdownModule,
        RadioButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        DataTableModule,
        DialogModule,
        MemoryDataTableModule,
        AbacoButtonsModule,
        BotoesExportacaoModule,
        TranslateModule.forChild({
            loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        BaselineComponent,
        BaselineViewComponent,
        BaselineFuncaoDadosComponent,
        BaselineFuncaoTransacaoComponent,
        BaselineComplexidadeComponent,
        BaselineImpactoComponent,
        BaselineInfSistemaComponent
    ],
    providers: [
        BaselineService,
        ConfirmationService,
        StringConcatService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoBaselineModule {
}
