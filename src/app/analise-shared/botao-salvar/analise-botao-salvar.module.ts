import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ButtonModule, TooltipModule } from 'primeng/primeng';
import { AnaliseBotaoSalvarComponent } from './analise-botao-salvar-component';
import { AbacoSharedModule } from '../../shared/abaco-shared.module';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ButtonModule,
    TooltipModule,
    AbacoSharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AnaliseBotaoSalvarComponent
  ],
  exports: [
    AnaliseBotaoSalvarComponent
  ]
})
export class AbacoAnaliseBotaoSalvarModule { }

