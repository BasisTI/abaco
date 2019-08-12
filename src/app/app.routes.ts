import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './login';

export const routes: Routes = [
  { 
    path: '', component: LoginComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
