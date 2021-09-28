import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rlr } from './rlr.model';


@Injectable()
export class RlrService {

    resourceUrl = environment.apiUrl + '/rlrs';

    constructor(private http: HttpClient) {
    }

    getRlrsByNomeSistema(nome: string, idSistema: number): Observable<Rlr[]>{
        return this.http.get<Rlr[]>(this.resourceUrl + "/sistema/"+ idSistema + "?nome="+nome);
    }

    dropDownByFuncaoDadosId(idFuncaoDados: number): Observable<any> {
        return this.http.get<any>(this.resourceUrl + '/drop-down/' + idFuncaoDados);
    }

}
