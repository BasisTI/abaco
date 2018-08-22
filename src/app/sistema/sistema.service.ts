import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {Sistema} from './sistema.model';
import {ResponseWrapper, createRequestOption, JhiDateUtils} from '../shared';

@Injectable()
export class SistemaService {

    resourceUrl = environment.apiUrl + '/sistemas';

    findByOrganizacaoUrl = this.resourceUrl + '/organizacao';

    searchUrl = environment.apiUrl + '/_search/sistemas';

    constructor(private http: HttpService) {
    }

    create(sistema: Sistema): Observable<Sistema> {
        const copy = this.convert(sistema);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(sistema: Sistema): Observable<Sistema> {
        const copy = this.convert(sistema);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Sistema> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get(url)
            .map((res: Response) => this.convertResponse(res));
    }

    /**
     * Método responsável por popular a lista de sistemas da organização selecionada.
     */
    findAllSystemOrg(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        console.log("url ", url);
        return this.http.get(url)
            .map((res: Response) => this.convertResponse(res));
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Sistema.
     */
    private convertItemFromServer(json: any): Sistema {
        const entity: Sistema = Sistema.fromJSON(json);
        return entity;
    }

    /**
     * Convert a Sistema to a JSON which can be sent to the server.
     */
    private convert(sistema: Sistema): Sistema {
        const copy: Sistema = Object.assign({}, sistema);
        return Sistema.toNonCircularJson(copy);
    }

}
