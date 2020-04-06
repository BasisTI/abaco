import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SecurityModule } from '@basis/angular-components';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    ConfirmationService,
    ConfirmDialogModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    EditorModule,
    InputTextareaModule,
    InputTextModule,
    MultiSelectModule,
    RadioButtonModule,
    SpinnerModule,
    TabViewModule
} from 'primeng/primeng';
import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';
import { AbacoAnaliseSharedModule } from '../analise-shared/analise-shared.module';
import { AbacoAnaliseBotaoSalvarModule } from '../analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoDerChipsModule } from '../analise-shared/der-chips/der-chips.module';
import { MemoryDataTableModule } from '../memory-datatable/memory-datatable.module';
import { AbacoSharedModule } from '../shared/abaco-shared.module';
import { AbacoEllipsisTooltipModule } from '../shared/ellipsis-tooltip/ellipsis-tooltip.module';
import { DerService } from './../der/der.service';
import { FuncaoDadosFormComponent } from './funcao-dados-form.component';
import { FuncaoDadosService } from './funcao-dados.service';





export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ButtonModule,
        SpinnerModule,
        CalendarModule,
        DropdownModule,
        RadioButtonModule,
        InputTextModule,
        DataTableModule,
        ConfirmDialogModule,
        AbacoButtonsModule,
        TabViewModule,
        InputTextareaModule,
        AbacoSharedModule,
        DialogModule,
        AbacoAnaliseSharedModule,
        MemoryDataTableModule,
        AbacoAnaliseBotaoSalvarModule,
        AbacoEllipsisTooltipModule,
        MultiSelectModule,
        AbacoDerChipsModule,
        AutoCompleteModule,
        CKEditorModule,
        SecurityModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        EditorModule
    ],
  declarations: [
    FuncaoDadosFormComponent
  ],
  exports: [
    FuncaoDadosFormComponent
  ],
  providers: [
    FuncaoDadosService,
    DerService,
    ConfirmationService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFuncaoDadosModule { }
