import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AbacoSharedModule } from '../shared';

import {
    AnalisEditComponent,
    analisesState
} from './';

@NgModule({
    imports: [
        AbacoSharedModule, 
        RouterModule.forRoot(analisesState, { useHash: true })
    ],
    declarations: [
        AnalisEditComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AbacoAnalisesModule {}
