import {CpfCnpjPipe} from './pipe/cpf-cnpj.pipe';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { DatePipe } from './pipe/date.pipe';
@NgModule({
    imports: [
    ],
    declarations: [
        CpfCnpjPipe,
        DatePipe
    ],
    providers: [],
    exports: [
        CpfCnpjPipe,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UtilModule { }
