import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  SecurityModule } from '@basis/angular-components';
import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';
import { AbacoSharedModule } from '../shared/abaco-shared.module';
import { AbacoAnaliseSharedModule } from '../analise-shared/analise-shared.module';
import { MemoryDataTableModule } from '../memory-datatable/memory-datatable.module';
import {
    ButtonModule,
    InputTextModule,
    SpinnerModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DataTableModule,
    ConfirmationService,
    TabViewModule,
    InputTextareaModule,
    DialogModule,
    AutoCompleteModule, EditorModule
} from 'primeng/primeng';

import {
  FuncaoTransacaoFormComponent,
} from './';
import { AbacoAnaliseBotaoSalvarModule } from '../analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoDerChipsModule } from '../analise-shared/der-chips/der-chips.module';
import { FuncaoTransacaoService } from './funcao-transacao.service';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PesquisarFuncaoTransacaoModule } from '../pesquisar-ft/pesquisar-ft.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

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
        CKEditorModule,
        SecurityModule,
        ReactiveFormsModule,
        AbacoSharedModule,
        DialogModule,
        AbacoAnaliseSharedModule,
        MemoryDataTableModule,
        AbacoAnaliseBotaoSalvarModule,
        AbacoDerChipsModule,
        AutoCompleteModule,
        PesquisarFuncaoTransacaoModule,
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
    FuncaoTransacaoFormComponent
  ],
  exports: [
    FuncaoTransacaoFormComponent
  ],
  providers: [
    ConfirmationService,
    FuncaoTransacaoService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFuncaoTransacaoModule {}
