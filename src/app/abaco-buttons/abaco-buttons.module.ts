import { ExportButtonComponent } from './export-button/export-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GreenButtonComponent } from './green-button/green-button.component';
import { BlueButtonComponent } from './blue-button/blue-button.component';
import { WhiteButtonComponent } from './white-button/white-button.component';
import { GrayButtonComponent } from './gray-button/gray-button.component';
import { RedButtonComponent } from './red-button/red-button.component';
import {
  ButtonModule, SplitButton, SplitButtonModule,
} from 'primeng/primeng';
import { SubmitButtonComponent } from './submit-button/submit-button.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    SplitButtonModule,
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })
  ],
  declarations: [
    GrayButtonComponent,
    GreenButtonComponent,
    BlueButtonComponent,
    WhiteButtonComponent,
    SubmitButtonComponent,
    RedButtonComponent,
    ExportButtonComponent
  ],
  exports: [
    GrayButtonComponent,
    GreenButtonComponent,
    BlueButtonComponent,
    WhiteButtonComponent,
    SubmitButtonComponent,
    RedButtonComponent,
    ExportButtonComponent
  ]
})
export class AbacoButtonsModule { }
