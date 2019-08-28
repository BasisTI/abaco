import { DataTable } from 'primeng/primeng';
import { FaseFilter } from './model/fase.filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Fase } from './model/fase.model';
import { RequestUtil } from '../util/requestUtil';

@Injectable()
export class FaseService {

    resourceUrl = environment.apiUrl + '/fases';

    constructor( private http: HttpClient ) {}

    create(fase: Fase): Observable<any> {
        const copy = Object.assign({}, fase);
        return this.http.post(this.resourceUrl, copy);
    }

    find(id: number): Observable<Fase> {
        return this.http.get(`${this.resourceUrl}/${id}`);
    }

    query(filtro: FaseFilter, datatable?: DataTable): Observable<any> {
        const options = {params: RequestUtil.getRequestParams(datatable) };
        return this.http.post(`${this.resourceUrl}/page`, filtro, options).map(res => res['content']);
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }
}
