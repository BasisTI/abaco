import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableModule, BlockUiModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import {
    BaselineComponent,
    BaselineFuncaoDadosComponent,
    BaselineFuncaoTransacaoComponent,
    BaselineInfSistemaComponent, baselineRoute, BaselineService,
    BaselineViewComponent
} from './';
import { BaselineComplexidadeComponent } from './analitico/complexidade/baseline-complexidade.component';
import { BaselineImpactoComponent } from './analitico/impacto/baseline-impacto.component';
import { SharedModule } from '../shared/shared.module';





@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot(baselineRoute, { useHash: true }),
        DatatableModule,
        AbacoButtonsModule,
        BlockUiModule,
        SharedModule
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
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BaselineModule {
}
