import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ButtonModule, TooltipModule } from 'primeng/primeng';
import { AnaliseBotaoSalvarComponent } from './analise-botao-salvar-component';
import { AbacoSharedModule } from '../../shared/abaco-shared.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ButtonModule,
    TooltipModule,
    AbacoSharedModule,
  ],
  declarations: [
    AnaliseBotaoSalvarComponent
  ],
  exports: [
    AnaliseBotaoSalvarComponent
  ]
})
export class AbacoAnaliseBotaoSalvarModule { }

