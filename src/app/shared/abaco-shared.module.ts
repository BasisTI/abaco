import { AnaliseService } from './../analise/analise.service';
import { NgModule } from '@angular/core';

import { FatorAjusteToSelectItemPipe } from './fator-ajuste-to-select-item.pipe';
import { AnaliseSharedDataService } from './analise-shared-data.service';

@NgModule({
    declarations: [
        FatorAjusteToSelectItemPipe
    ],
    providers: [
        AnaliseSharedDataService,
        AnaliseService
    ],
    exports: [
        FatorAjusteToSelectItemPipe
    ]
})
export class AbacoSharedModule { }

