
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { VisaoPfModelComponent } from './visao-pf-model.component';


export const visaopfModelRoute: Routes = [
    { path: 'visaopf/model', component: VisaoPfModelComponent, canActivate: [AuthGuard] } ,
    { path: 'visaopf/model/byuuid/:uuid', component: VisaoPfModelComponent },
];
