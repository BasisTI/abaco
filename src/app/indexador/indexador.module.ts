import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IndexadorService } from './indexador.service';
import { indexadorRoute } from './indexador.router';
import { RouterModule } from '@angular/router';
import { IndexadorComponent } from './indexador.component';

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {AbacoButtonsModule} from '../abaco-buttons/abaco-buttons.module';
import {MultiSelectModule} from 'primeng/multiselect';
import {FormsModule} from '@angular/forms';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        RouterModule.forRoot(indexadorRoute, {useHash: true}),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        }),
        AbacoButtonsModule,
        MultiSelectModule,
        FormsModule
    ],
    declarations: [
        IndexadorComponent
    ],
    providers: [
        IndexadorService,
      ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class AbacoIndexadorModule {}
