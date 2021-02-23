import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginSuccessComponent } from '@nuvem/angular-base';
import { DiarioErrosComponent } from './components/diario-erros/diario-erros.component';
import { ConfiguracaoBaselineComponent } from './configuracao-baseline';
import { IndexadorComponent } from './indexador/indexador.component';
import { LoginComponent } from './login';




const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'diario-erros', component: DiarioErrosComponent, data: { breadcrumb: 'Diário de Erros'} },
  { path: 'login-success', component: LoginSuccessComponent },
  { path: 'indexador', component: IndexadorComponent, data: { breadcrumb: 'Reindexar'} },
  { path: 'configuracao-baseline', component: ConfiguracaoBaselineComponent, data: { breadcrumb: 'Configuração Baseline'} },
  { path: 'login', component: LoginComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
