import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AnaliseBotaoSalvarComponent } from './analise-botao-salvar-component';

import { AbacoAnaliseSharedModule } from '../analise-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    AbacoAnaliseSharedModule,
    SharedModule,
  ],
  declarations: [
    AnaliseBotaoSalvarComponent
  ],
  exports: [
    AnaliseBotaoSalvarComponent
  ]
})
export class AbacoAnaliseBotaoSalvarModule { }

