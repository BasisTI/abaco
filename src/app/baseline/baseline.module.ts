import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from '../shared/shared.module';
import {
    BaselineComponent,
    BaselineFuncaoDadosComponent,
    BaselineFuncaoTransacaoComponent,
    BaselineInfSistemaComponent, baselineRoute, BaselineService,
    BaselineViewComponent
} from './';
import { BaselineComplexidadeComponent } from './analitico/complexidade/baseline-complexidade.component';
import { BaselineImpactoComponent } from './analitico/impacto/baseline-impacto.component';





@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot(baselineRoute, { useHash: true }),
        DatatableModule,
        AbacoButtonsModule,
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
