import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { PesquisarFtComponent } from '../pesquisar-ft/pesquisar-ft.component'

export const PesquisarFtRoutes: Routes = [
    {
        path: 'analise/:id/edit/searchft',
        component: PesquisarFtComponent
    }
];