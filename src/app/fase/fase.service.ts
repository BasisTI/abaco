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
        return this.http.post(this.resourceUrl, fase);
    }

    find(id: number): Observable<Fase> {
        return this.http.get(`${this.resourceUrl}/${id}`);
    }

    getPage(filtro: FaseFilter, datatable: DataTable): Observable<any> {
        const options = {params: RequestUtil.getRequestParams(datatable) };
        return this.http.post(`${this.resourceUrl}/page`, filtro, options);
    }

    findDropdown(): Observable<any> {
        return this.http.get(`${this.resourceUrl}/dropdown`);
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }
}
