
import { AuthGuard } from '@nuvem/angular-base';
import { Routes } from '@angular/router';
import { VisaopfListModelsComponent } from './visao-pf-list-models.component';
import { VisaoPfModelComponent } from '../visao-pf-model/visao-pf-model.component';


export const visaopfListModelsRoute: Routes = [
    { path: 'visaopf/list/models', component: VisaopfListModelsComponent, canActivate: [AuthGuard] } ,
    { path: 'visaopf/model/byuuid/:uuid', component: VisaoPfModelComponent },
];
