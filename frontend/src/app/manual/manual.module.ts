import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from '../shared/shared.module';
import {
  ManualListComponent,
  manualRoute, ManualService
} from './';
import { ManualDetailComponent } from './manual-detail/manual-detail.component';
import { ManualFormComponent } from './manual-form/manual-form.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(manualRoute, { useHash: true }),
    DatatableModule,
    AbacoButtonsModule,
    SharedModule
  ],
  declarations: [
    ManualListComponent,
    ManualDetailComponent,
    ManualFormComponent,
  ],
  providers: [
    ManualService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ManualModule {}
