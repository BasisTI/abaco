import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Contrato } from './contrato.model';
import { DateUtils } from 'ng-jhipster';
@Injectable()
export class ContratoService {

    private resourceUrl = 'api/contratoes';
    private resourceSearchUrl = 'api/_search/contratoes';

    constructor(private http: Http, private dateUtils: DateUtils) { }

    create(contrato: Contrato): Observable<Contrato> {
        let copy: Contrato = Object.assign({}, contrato);
        copy.dataInicioVigencia = this.dateUtils
            .convertLocalDateToServer(contrato.dataInicioVigencia);
        copy.dataFimVigencia = this.dateUtils
            .convertLocalDateToServer(contrato.dataFimVigencia);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(contrato: Contrato): Observable<Contrato> {
        let copy: Contrato = Object.assign({}, contrato);
        copy.dataInicioVigencia = this.dateUtils
            .convertLocalDateToServer(contrato.dataInicioVigencia);
        copy.dataFimVigencia = this.dateUtils
            .convertLocalDateToServer(contrato.dataFimVigencia);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<Contrato> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            let jsonResponse = res.json();
            jsonResponse.dataInicioVigencia = this.dateUtils
                .convertLocalDateFromServer(jsonResponse.dataInicioVigencia);
            jsonResponse.dataFimVigencia = this.dateUtils
                .convertLocalDateFromServer(jsonResponse.dataFimVigencia);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<Response> {
        let options = this.createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res))
        ;
    }

    private convertResponse(res: any): any {
        let jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            jsonResponse[i].dataInicioVigencia = this.dateUtils
                .convertLocalDateFromServer(jsonResponse[i].dataInicioVigencia);
            jsonResponse[i].dataFimVigencia = this.dateUtils
                .convertLocalDateFromServer(jsonResponse[i].dataFimVigencia);
        }
        res._body = jsonResponse;
        return res;
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
