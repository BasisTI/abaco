
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { VisaoPfComponent } from './visao-pf.component';

export const visaopfRoute: Routes = [

    { path: 'visaopf/deteccomponentes', component: VisaoPfComponent, canActivate: [AuthGuard] } ,
    { path: 'visaopf/deteccomponentes/:idTela', component: VisaoPfComponent },

];
