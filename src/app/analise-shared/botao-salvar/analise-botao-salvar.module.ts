import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/primeng';
import { AnaliseBotaoSalvarComponent } from './analise-botao-salvar-component';
import { AbacoSharedModule } from '../../shared/abaco-shared.module';
import { AbacoButtonsModule } from '../../abaco-buttons/abaco-buttons.module';

@NgModule({
  imports: [
    ButtonModule,
    AbacoSharedModule,
    AbacoButtonsModule,
  ],
  declarations: [
    AnaliseBotaoSalvarComponent
  ],
  exports: [
    AnaliseBotaoSalvarComponent
  ]
})
export class AbacoAnaliseBotaoSalvarModule { }

