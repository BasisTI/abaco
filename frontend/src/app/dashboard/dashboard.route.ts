import { Routes } from '@angular/router';
import { DashboardModule } from './dashboard.module';
import { DashboardComponent } from './dashboard.component';
import { AuthGuardService } from '../util/auth.guard.service';


export const dashboardRoute: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];
