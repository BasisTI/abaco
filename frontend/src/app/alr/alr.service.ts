import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alr } from './alr.model';


@Injectable()
export class AlrService {

    resourceUrl = environment.apiUrl + '/alrs';

    constructor(private http: HttpClient) {
    }

    getAlrsByNomeSistema(nome: string, idSistema: number): Observable<Alr[]>{
        return this.http.get<Alr[]>(this.resourceUrl + "/sistema/"+ idSistema + "?nome="+nome);
    }

}
