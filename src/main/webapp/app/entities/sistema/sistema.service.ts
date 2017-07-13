import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Sistema } from './sistema.model';
import {Organizacao} from "../organizacao/organizacao.model";
@Injectable()
export class SistemaService {

    private resourceUrl = 'api/sistemas';
    private resourceSearchUrl = 'api/_search/sistemas';
    //private resourceUrl = '/sistemas/organizations';

    constructor(private http: Http) { }

    create(sistema: Sistema): Observable<Sistema> {
        let copy: Sistema = Object.assign({}, sistema);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(sistema: Sistema): Observable<Sistema> {
        let copy: Sistema = Object.assign({}, sistema);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Sistema> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    findByOrganization(organization:Organizacao,req?: any) {
        let copy: Organizacao = Object.assign({}, organization);
        //alert(JSON.stringify(copy));
        return this.http.post(`${this.resourceUrl}/organizations`,copy);
    }


    query(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            ;
    }


    private createRequestOption(req?: any): BaseRequestOptions {
        let options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            let params: URLSearchParams = new URLSearchParams();
            params.set('page', req.page);
            params.set('size', req.size);
            if (req.sort) {
                params.paramsMap.set('sort', req.sort);
            }
            params.set('query', req.query);

            options.search = params;
        }
        return options;
    }
}
