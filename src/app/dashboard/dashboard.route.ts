import { Routes } from '@angular/router';
import { DashboardModule } from './dashboard.module';
import { DashboardComponent } from './dashboard.component';


export const dashboardRoute: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];
