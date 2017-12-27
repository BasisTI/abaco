import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Sistema } from './sistema.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

import * as _ from 'lodash';

@Injectable()
export class SistemaService {

  resourceUrl = environment.apiUrl + '/sistemas';

  searchUrl = environment.apiUrl + '/_search/sistemas';

  constructor(private http: HttpService) {}

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
    const entity: Sistema = Object.assign(new Sistema(), json);
    return entity;
  }

  /**
   * Convert a Sistema to a JSON which can be sent to the server.
   */
  private convert(sistema: Sistema): Sistema {
    const copy: Sistema = _.cloneDeep(sistema);
    return copy.toNonCircularJson();
  }

}
