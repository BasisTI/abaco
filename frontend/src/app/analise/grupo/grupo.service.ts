import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ResponseWrapper} from '../../shared';
import {Observable} from '../../../../node_modules/rxjs';
import {Grupo} from './grupo.model';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class GrupoService {

    resourceUrl = environment.apiUrl + '/';
    grupoUrl = this.resourceUrl + 'analises';

    constructor(private http: HttpClient) {
    }

    all(): Observable<ResponseWrapper> {
        return this.http.get<ResponseWrapper>(`${this.grupoUrl}`);
    }

    private convertResponse(res): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItem(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItem(json: any): Grupo {
        return Grupo.convertJsonToObject(json);
    }


}
