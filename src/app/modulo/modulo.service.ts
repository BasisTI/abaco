import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Modulo } from './modulo.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class ModuloService {

  resourceUrl = environment.apiUrl + '/modulos';

  searchUrl = environment.apiUrl + '/_search/modulos';

  constructor(private http: HttpService) {}

  create(modulo: Modulo): Observable<Modulo> {
    const copy = this.convert(modulo);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  update(modulo: Modulo): Observable<Modulo> {
    const copy = this.convert(modulo);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  find(id: number): Observable<Modulo> {
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
   * Convert a returned JSON object to Modulo.
   */
  private convertItemFromServer(json: any): Modulo {
    const entity: Modulo = Object.assign(new Modulo(), json);
    return entity;
  }

  /**
   * Convert a Modulo to a JSON which can be sent to the server.
   */
  private convert(modulo: Modulo): Modulo {
    const copy: Modulo = Object.assign({}, modulo);
    return copy;
  }
}
