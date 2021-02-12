import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class DerService {

    resourceUrl = environment.apiUrl + '/ders';

    constructor(private http: HttpClient) {
    }

    dropDownByFuncaoDadosId(idFuncaoDados: number): Observable<any> {
        return this.http.get<any>(this.resourceUrl + '/drop-down/' + idFuncaoDados);
    }

}
