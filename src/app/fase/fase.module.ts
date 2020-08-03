import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from './../shared/shared.module';
import { FaseDetailComponent } from './fase-detail/fase-detail.component';
import { FaseFormComponent } from './fase-form/fase-form.component';
import { FaseListComponent } from './fase-list/fase-list.component';
import { FaseRoute } from './fase.route';
import { FaseService } from './fase.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forRoot(FaseRoute, { useHash: true }),
        BrowserModule,
        AbacoButtonsModule,
        SharedModule,
        CommonModule,
        SharedModule,
        DatatableModule,

    ],
    declarations: [
        FaseListComponent,
        FaseDetailComponent,
        FaseFormComponent
    ],
    providers: [
        FaseService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FaseModule {
}
