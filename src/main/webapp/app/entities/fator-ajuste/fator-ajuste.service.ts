import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { FatorAjuste } from './fator-ajuste.model';
import {Manual} from "../manual/manual.model";
@Injectable()
export class FatorAjusteService {

    private resourceUrl = 'api/fator-ajustes';
    private resourceSearchUrl = 'api/_search/fator-ajustes';

    constructor(private http: Http) { }

    create(fatorAjuste: FatorAjuste): Observable<FatorAjuste> {
        let copy: FatorAjuste = Object.assign({}, fatorAjuste);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(fatorAjuste: FatorAjuste): Observable<FatorAjuste> {
        let copy: FatorAjuste = Object.assign({}, fatorAjuste);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<FatorAjuste> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    findByManual(manual:Manual,req?: any) {
        let copy: Manual = Object.assign({}, manual);
        //alert(JSON.stringify(copy));
        return this.http.post(`${this.resourceUrl}/manual`,copy);
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
