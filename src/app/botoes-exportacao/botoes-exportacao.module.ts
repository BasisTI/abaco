import { BotoesExportacaoComponent } from './botoes-exportacao.component';
import { SplitButtonModule } from 'primeng/primeng';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageNotificationService } from '@basis/angular-components';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
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
    BotoesExportacaoComponent
  ],
  providers: [],
  exports: [BotoesExportacaoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BotoesExportacaoModule {
}
