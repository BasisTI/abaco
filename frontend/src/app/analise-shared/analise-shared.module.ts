import { FieldsetModule } from 'primeng/fieldset';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModuloFuncionalidadeComponent } from './modulo-funcionalidade.component';
import { FuncaoResumoTableComponent } from './funcao-resumo-table.component';

import { HttpClientModule} from '@angular/common/http';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from '../shared/shared.module';
import { ArquivoUploadComponent } from './arquivo-upload.component';



@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        DatatableModule,
        AbacoButtonsModule,
        FieldsetModule,
        SharedModule
    ],
    declarations: [
        ModuloFuncionalidadeComponent,
        FuncaoResumoTableComponent,
        ArquivoUploadComponent
    ],
    exports: [
        ModuloFuncionalidadeComponent,
        FuncaoResumoTableComponent,
        ArquivoUploadComponent
    ]
})
export class AbacoAnaliseSharedModule { }
