import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DatatableModule} from '@basis/angular-components';

import {BotoesExportacaoModule} from './../botoes-exportacao/botoes-exportacao.module';

import {AbacoButtonsModule} from '../abaco-buttons/abaco-buttons.module';

import {MemoryDataTableModule} from '../memory-datatable/memory-datatable.module';

import {
    ButtonModule,
    InputTextModule,
    SpinnerModule,
    CalendarModule,
    DropdownModule,
    RadioButtonModule,
    ConfirmDialogModule,
    ToggleButtonModule,
    DialogModule,
    CheckboxModule,
    DataTableModule,
    ConfirmationService,
    TabViewModule,
    InputTextareaModule,
} from 'primeng/primeng';

import {
    AnaliseService,
    GrupoService,
    AnaliseComponent,
    AnaliseDetailComponent,
    AnaliseFormComponent,
    AnaliseViewComponent,
    analiseRoute
} from './';

import {AbacoFuncaoDadosModule} from '../funcao-dados/funcao-dados.module';
import {AbacoSharedModule} from '../shared/abaco-shared.module';
import {AbacoFuncaoTransacaoModule} from '../funcao-transacao/funcao-transacao.module';
import {AbacoAnaliseResumoModule} from './resumo/analise-resumo.module';
import {AbacoAnaliseBotaoSalvarModule} from '../analise-shared/botao-salvar/analise-botao-salvar.module';
import {UtilModule} from '../util/util.module';
import { GenericService } from '../util/service/generic.service';

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        RouterModule.forRoot(analiseRoute, {useHash: true}),
        DatatableModule,
        ButtonModule,
        SpinnerModule,
        CalendarModule,
        DropdownModule,
        RadioButtonModule,
        InputTextModule,
        DataTableModule,
        ConfirmDialogModule,
        DialogModule,
        ToggleButtonModule,
        CheckboxModule,
        AbacoButtonsModule,
        TabViewModule,
        InputTextareaModule,
        AbacoFuncaoDadosModule,
        AbacoSharedModule,
        AbacoFuncaoTransacaoModule,
        AbacoAnaliseResumoModule,
        AbacoAnaliseBotaoSalvarModule,
        BotoesExportacaoModule,
        UtilModule,
        MemoryDataTableModule
    ],
    declarations: [
        AnaliseComponent,
        AnaliseDetailComponent,
        AnaliseFormComponent,
        AnaliseViewComponent,
    ],
    providers: [
        AnaliseService,
        GrupoService,
        ConfirmationService,
        GenericService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoAnaliseModule {
}
