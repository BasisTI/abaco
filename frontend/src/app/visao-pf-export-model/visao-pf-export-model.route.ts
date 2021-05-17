
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { VisaoPfExportModelComponent } from './visao-pf-export-model.component';


export const visaopfExportModelRoute: Routes = [
    { path: 'visaopf/export/model', component: VisaoPfExportModelComponent, canActivate: [AuthGuard] } ,
];
