import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { PesquisarFtComponent } from './pesquisar-ft.component';
import { HttpClient } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';

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
    SharedModule
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


