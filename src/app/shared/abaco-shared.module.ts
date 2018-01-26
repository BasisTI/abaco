import { NgModule } from '@angular/core';

import { FatorAjusteToSelectItemPipe, AnaliseSharedDataService } from './index';

@NgModule({
    declarations: [
        FatorAjusteToSelectItemPipe
    ],
    providers: [
        AnaliseSharedDataService
    ],
    exports: [
        FatorAjusteToSelectItemPipe
    ]
})
export class AbacoSharedModule { }

