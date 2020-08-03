import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableModule } from '@nuvem/primeng-components';
import { FieldsetModule } from 'primeng/fieldset';
import { AbacoAnaliseBotaoSalvarModule } from '../analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from '../shared/shared.module';
import {
    AnaliseDetailComponent,
    AnaliseFormComponent, AnaliseListComponent,
    analiseRoute, AnaliseService,
    AnaliseViewComponent, GrupoService
} from './';
import { FuncaoDadosModule } from '../funcao-dados/funcao-dados.module';
import { FuncaoTransacaoModule } from '../funcao-transacao/funcao-transacao.module';
import { AnaliseResumoComponent } from './analise-resumo/analise-resumo.component';





@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forRoot(analiseRoute, {useHash: true}),
        DatatableModule,
        AbacoButtonsModule,
        FuncaoDadosModule,
        FuncaoTransacaoModule,
        AbacoAnaliseBotaoSalvarModule,
        FieldsetModule,
        SharedModule,
    ],
    declarations: [
        AnaliseListComponent,
        AnaliseDetailComponent,
        AnaliseFormComponent,
        AnaliseViewComponent,
        AnaliseResumoComponent,
    ],
    providers: [
        AnaliseService,
        GrupoService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnaliseModule {
}
