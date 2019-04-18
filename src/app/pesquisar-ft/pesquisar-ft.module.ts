import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes } from '@angular/router';



import { PesquisarFtComponent } from './pesquisar-ft.component'
const rotas: Routes = [
    {
        path: 'analise/:id/edit/searchft',
        component: PesquisarFtComponent
    }
];
@NgModule({
})
export class PesquisarFuncaoTransacaoModule {

};


