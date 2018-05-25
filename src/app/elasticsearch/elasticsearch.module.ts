import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ElasticSearchService } from './elasticsearch.service';
import { elasticsearchRoute } from './elasticsearch.router';
import { RouterModule } from '@angular/router';
import { ElasticSearchComponent } from './elasticsearch.component';

@NgModule({
    imports: [
        RouterModule.forRoot(elasticsearchRoute, { useHash: true }),
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
