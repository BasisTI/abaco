import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableModule } from '@nuvem/primeng-components';
import { FieldsetModule } from 'primeng/fieldset';
import { SharedModule } from '../shared/shared.module';
import { DivergenciaDetailComponent, DivergenciaFormComponent, DivergenciaListComponent, divergenciaRoute, DivergenciaService } from '.';
import { FuncaoDadosModule } from '../funcao-dados/funcao-dados.module';
import { FuncaoTransacaoModule } from '../funcao-transacao/funcao-transacao.module';
import { TableModule } from 'primeng';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';





@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forRoot(divergenciaRoute, {useHash: true}),
        DatatableModule,
        FuncaoDadosModule,
        FuncaoTransacaoModule,
        FieldsetModule,
        SharedModule,
        TableModule,
        AbacoButtonsModule,
    ],
    declarations: [
        DivergenciaListComponent,
        DivergenciaDetailComponent,
        DivergenciaFormComponent,
    ],
    providers: [
        DivergenciaService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DivergenciaModule {}
