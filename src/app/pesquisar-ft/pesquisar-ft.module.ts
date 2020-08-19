import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { PesquisarFtComponent } from './pesquisar-ft.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule, TableModule } from 'primeng';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { DatatableModule } from '@nuvem/primeng-components';

const rotas: Routes = [
  {
    path: 'analise/:id/edit/searchft',
    component: PesquisarFtComponent
  }
];
@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    AbacoButtonsModule,
    HttpClientModule,
    SharedModule,
    DatatableModule,
    TableModule,
  ],
  declarations: [
    PesquisarFtComponent
  ],
  exports: [
    PesquisarFtComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PesquisarFuncaoTransacaoModule {

};


