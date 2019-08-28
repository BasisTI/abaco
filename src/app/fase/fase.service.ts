import { DataTable } from 'primeng/primeng';
import { FaseFilter } from './model/fase.filter';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Fase } from './model/fase.model';
import { Page } from '../util/page';
import { RequestUtil } from '../util/requestUtil';

@Injectable()
export class FaseService {

    resourceUrl = environment.apiUrl + '/fases';

    constructor( private http: HttpClient ) {}

    create(fase: Fase): Observable<any> {
        const copy = this.convert(fase);
        return Observable.from(
            this.http.post(this.resourceUrl, copy)
        );
    }

    find(id: number): Observable<Fase> {
        return this.http.get(`${this.resourceUrl}/${id}`)
        .map( (res: Fase) => this.convertItemFromServer(res) );
    }

    query(filtro?: FaseFilter, datatable?: DataTable): Observable<Fase[]> {
        const options = {params: RequestUtil.getRequestParams(datatable) };
        if (!filtro) {
            filtro = new FaseFilter();
        }
        return this.http.post(`${this.resourceUrl}/page`, filtro, options).map((res: Page<Fase>) => {
            const tiposFaseJson: Page<Fase> = res;
            const tiposFase: Fase[] = [];
            tiposFaseJson.content.forEach(fase => {
                tiposFase.push( this.convertItemFromServer(fase) );
            });
            return tiposFase;
        });
    }

    delete(id: number): Observable<Object> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertItemFromServer(json: any): Fase {
        const entity: Fase = Object.assign(new Fase(), json);
        return entity;
    }

    private convert(tipoFase: Fase): Fase {
        const copy: Fase = Object.assign({}, tipoFase);
        return copy;
    }
}
