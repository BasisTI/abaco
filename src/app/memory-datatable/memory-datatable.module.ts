import { MemoryDatatableComponent } from './memory-datatable.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, TooltipModule, DataTableModule } from 'primeng/primeng';
import { DatatableModule } from '@basis/angular-components';

import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    DataTableModule,
    DatatableModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    MemoryDatatableComponent
  ],
  exports: [
    MemoryDatatableComponent,
    DataTableModule,
    ButtonModule,
    TooltipModule
  ]
})

export class MemoryDataTableModule {

}
