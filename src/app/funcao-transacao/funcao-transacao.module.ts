import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FuncaoTransacaoService } from './funcao-transacao.service';
import { SecurityModule } from '@nuvem/angular-base';
import { DatatableModule } from '@nuvem/primeng-components';
import { FuncaoTransacaoFormComponent } from './funcao-transacao-form.component';
import { AbacoButtonsModule } from 'src/app/components/abaco-buttons/abaco-buttons.module';
import { AbacoAnaliseSharedModule } from 'src/app/analise-shared/analise-shared.module';
import { AbacoAnaliseBotaoSalvarModule } from 'src/app/analise-shared/botao-salvar/analise-botao-salvar.module';
import { AbacoDerChipsModule } from 'src/app/analise-shared/der-chips/der-chips.module';
import { funcaoTransacaoRoute } from './funcao-transacao.route';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { ConfirmationService } from 'primeng';
import { PesquisarFuncaoTransacaoModule } from '../pesquisar-ft/pesquisar-ft.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DatatableModule,
        AbacoButtonsModule,
        SecurityModule,
        ReactiveFormsModule,
        AbacoAnaliseSharedModule,
        AbacoAnaliseBotaoSalvarModule,
        AbacoDerChipsModule,
        SharedModule,
        RouterModule.forRoot(funcaoTransacaoRoute, {useHash: true}),
        PesquisarFuncaoTransacaoModule,

    ],
  declarations: [
    FuncaoTransacaoFormComponent
  ],
  exports: [
    FuncaoTransacaoFormComponent
  ],
  providers: [
    FuncaoTransacaoService,
    ConfirmationService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FuncaoTransacaoModule {}
