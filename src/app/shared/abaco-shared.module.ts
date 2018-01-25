import { NgModule } from '@angular/core';

import { FatorAjusteToSelectItemPipe } from './index';

@NgModule({
    declarations: [
        FatorAjusteToSelectItemPipe
    ],
    exports: [
        FatorAjusteToSelectItemPipe
    ]
})
export class AbacoSharedModule { }

