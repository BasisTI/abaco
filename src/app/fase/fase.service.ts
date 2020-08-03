import { DatatableComponent } from '@nuvem/primeng-components';
import { FaseFilter } from './model/fase.filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Fase } from './model/fase.model';
import { createRequestOption } from '../shared/request-util';

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

    getPage(filtro: FaseFilter, datatable: DatatableComponent): Observable<any> {
        const options = createRequestOption(datatable);
        return this.http.post(`${this.resourceUrl}/page`, options);
    }

    findDropdown(): Observable<any> {
        return this.http.get(`${this.resourceUrl}/dropdown`);
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }
}
