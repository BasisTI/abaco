import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '@basis/angular-components';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';


@Injectable()
export class DerService {

    resourceUrl = environment.apiUrl + '/ders';

    constructor(private http: HttpService) {
    }

    dropDownByFuncaoDadosId(idFuncaoDados: number): Observable<any> {
        return this.http.get(this.resourceUrl + '/drop-down/' + idFuncaoDados)
            .map((res: Response) => res.json());
    }

}
