import { Routes } from '@angular/router';
import { RecuperarSenhaFormComponent } from './senha-rec/recuperar-senha-form';
import { RecuperarSenhaComponent } from './senha-rec/recuperar-senha.component';
import { SenhaComponent } from './senha.component';
import { SenhaFormComponent } from './senha.form-component';


export const senhaRoute: Routes = [
    {
        path: 'senha',
        component: SenhaFormComponent,
        data: {
            breadcrumb: "Senha"
        }
    },
    {
        path: 'senha/rec',
        component: RecuperarSenhaComponent,
        data: {
            breadcrumb: "Senha"
        }
    },
    {
        path: 'reset/finish',
        component: RecuperarSenhaFormComponent,
        data: {
            breadcrumb: "Senha"
        }
    }
];
