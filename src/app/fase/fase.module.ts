import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BotoesExportacaoModule } from '../botoes-exportacao/botoes-exportacao.module';
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
} from 'primeng/primeng';

import {
    FaseService,
    FaseComponent,
    FaseDetailComponent,
    FaseFormComponent,
    FaseRoute
} from '.';

import { AbacoButtonsModule } from '../abaco-buttons/abaco-buttons.module';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(FaseRoute, { useHash: true }),
        DataTableModule,
        ButtonModule,
        SpinnerModule,
        CalendarModule,
        DropdownModule,
        RadioButtonModule,
        InputTextModule,
        ConfirmDialogModule,
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
        FaseComponent,
        FaseDetailComponent,
        FaseFormComponent
    ],
    providers: [
        FaseService,
        ConfirmationService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoFaseModule {
}
