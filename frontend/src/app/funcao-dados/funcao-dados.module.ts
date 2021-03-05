import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuncaoDadosFormComponent } from './funcao-dados-form.component';
import { FuncaoDadosService } from './funcao-dados.service';
import { SecurityModule } from '@nuvem/angular-base';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from 'src/app/components/abaco-buttons/abaco-buttons.module';
import { AbacoAnaliseSharedModule } from 'src/app/analise-shared/analise-shared.module';
import { AbacoAnaliseBotaoSalvarModule } from 'src/app/analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoDerChipsModule } from 'src/app/analise-shared/der-chips/der-chips.module';
import { DerService } from 'src/app/der/der.service';
import { AnaliseSharedDataService } from '../shared/analise-shared-data.service';
import { RouterModule } from '@angular/router';
import { funcaoDadosRoute } from './funcao-dados.route';
import { BaselineService } from '../baseline';
import { SharedModule } from '../shared/shared.module';
import { PesquisarFuncaoTransacaoModule } from '../pesquisar-ft/pesquisar-ft.module';
import { FuncaoTransacaoDivergenceComponent } from '../funcao-transacao';
import { FuncaoDadosDivergenceComponent } from './funcao-dados-divergence/funcao-dados-divergence.component';
import { PaginatorModule } from 'primeng';





@NgModule({
    imports: [
        RouterModule.forRoot(funcaoDadosRoute, {useHash: true}),
        CommonModule,
        HttpClientModule,
        FormsModule,
        AbacoButtonsModule,
        AbacoAnaliseSharedModule,
        AbacoAnaliseBotaoSalvarModule,
        AbacoDerChipsModule,
        SecurityModule,
        DatatableModule,
        ReactiveFormsModule,
        SharedModule,
        PesquisarFuncaoTransacaoModule,
        PaginatorModule,
    ],
  declarations: [
    FuncaoDadosFormComponent,
    FuncaoDadosDivergenceComponent,
  ],
  exports: [
    FuncaoDadosFormComponent,
    FuncaoDadosDivergenceComponent,
  ],
  providers: [
    FuncaoDadosService,
    DerService,
    BaselineService,
    AnaliseSharedDataService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FuncaoDadosModule { }
