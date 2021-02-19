import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConfiguracaoBaseline } from './model/configuracao-baseline.model';
import { catchError } from 'rxjs/operators';
import { ConfiguracaoSistemaEquipe } from './model/configuracao-sistema-equipe.model';


@Injectable()
export class ConfiguracaoBaselineService {

    resourceUrl = environment.apiUrl + '/configuracao-baseline';

    constructor( 
        private http: HttpClient,
        private pageNotificationService: PageNotificationService,
        ) {}

    create(configuracao: ConfiguracaoSistemaEquipe): Observable<any> {
        return this.http.post(this.resourceUrl, configuracao);
    }

    getAll(): Observable<ConfiguracaoSistemaEquipe> {
        return this.http.get<ConfiguracaoSistemaEquipe>(this.resourceUrl + '/').pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    getLabel(label) {
        return label;
    }
}
