import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ElasticSearchService } from './elasticsearch.service';
import { elasticsearchRoute } from './elasticsearch.router';
import { RouterModule } from '@angular/router';
import { ElasticSearchComponent } from './elasticsearch.component';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        RouterModule.forRoot(elasticsearchRoute, { useHash: true }),
        TranslateModule.forChild({
            loader: {
              provide: TranslateLoader,
              useFactory: (createTranslateLoader),
              deps: [HttpClient]
            }
          })
    ],
    declarations: [
        ElasticSearchComponent
    ],
    providers: [
        ElasticSearchService,
      ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class AbacoElasticSearchModule {}
