import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSuccessComponent } from '@nuvem/angular-base';
import { DiarioErrosComponent } from './components/diario-erros/diario-erros.component';
import { ConfiguracaoBaselineComponent } from './configuracao-baseline';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IndexadorComponent } from './indexador/indexador.component';
import { LoginComponent } from './login';
import { AuthGuardService } from './util/auth.guard.service';
import { FirstGuardService } from './util/first.guard.service';




const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [FirstGuardService], data: { breadcrumb: 'Login'}},
  { path: 'diario-erros', component: DiarioErrosComponent, canActivate: [AuthGuardService] ,  data: { breadcrumb: 'Diário de Erros'} },
  { path: 'login-success', component: LoginSuccessComponent, data: { breadcrumb: 'Login Sucesso'}},
  { path: 'indexador', component: IndexadorComponent , canActivate: [AuthGuardService] , data: { breadcrumb: 'Reindexar'} },
  { path: 'configuracao-baseline', component: ConfiguracaoBaselineComponent , canActivate: [AuthGuardService] , data: { breadcrumb: 'Configuração Baseline'} },
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login'}},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
