import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NomenclaturaListComponent } from './nomenclatura-list/nomenclatura-list.component';
import { NomenclaturaDetailComponent } from './nomenclatura-detail/nomenclatura-detail.component';
import { NomenclaturaFormComponent } from './nomenclatura-form/nomenclatura-form.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatatableModule } from '@nuvem/primeng-components';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { SharedModule } from '../shared/shared.module';
import { AdminGuard } from '../util/admin.guard';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CheckboxModule } from 'primeng';
import { NomenclaturaService } from './nomenclatura.service';
import { nomenclaturaRoute } from './nomenclatura.route';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(nomenclaturaRoute, {useHash: true}),
    DatatableModule,
    AbacoButtonsModule,
    SharedModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    DatatableModule,
    AbacoButtonsModule,
    SharedModule,
    CheckboxModule,
],
  declarations: [NomenclaturaListComponent, NomenclaturaDetailComponent, NomenclaturaFormComponent],
  providers: [
    NomenclaturaService,
    AdminGuard,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NomenclaturaModule { }
