import { MemoryDatatableComponent } from './memory-datatable.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, TooltipModule, DataTableModule } from 'primeng/primeng';
import { DatatableModule } from '@basis/angular-components';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        TooltipModule,
        DataTableModule,
        DatatableModule
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
