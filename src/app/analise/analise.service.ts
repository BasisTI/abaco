import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class AnaliseService {

  private resourceUrl = 'api/analises';

  constructor(private http: Http) { }

  query(req?: any): Observable<Response> {
    let options = this.createRequestOption(req);
    return this.http.get(this.resourceUrl, options)
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
