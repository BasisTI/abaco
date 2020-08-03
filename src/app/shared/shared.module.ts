import { NgModule } from '@angular/core';
import { JhiDateUtils } from './date-util.service';
import { PRIMENG_IMPORTS } from './primeng-imports';

@NgModule({
    imports: [
        PRIMENG_IMPORTS,
    ],
    providers: [
        JhiDateUtils
    ],
    exports: [
        PRIMENG_IMPORTS,
    ]
})
export class SharedModule { }
