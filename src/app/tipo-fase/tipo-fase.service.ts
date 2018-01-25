import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { TipoFase } from './tipo-fase.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class TipoFaseService {

  resourceUrl = environment.apiUrl + '/fases';

  searchUrl = environment.apiUrl + '/_search/fases';

  constructor(private http: HttpService) {}

  create(tipoFase: TipoFase): Observable<TipoFase> {
    const copy = this.convert(tipoFase);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  update(tipoFase: TipoFase): Observable<TipoFase> {
    const copy = this.convert(tipoFase);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  find(id: number): Observable<TipoFase> {
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
   * Convert a returned JSON object to TipoFase.
   */
  private convertItemFromServer(json: any): TipoFase {
    const entity: TipoFase = Object.assign(new TipoFase(), json);
    return entity;
  }

  /**
   * Convert a TipoFase to a JSON which can be sent to the server.
   */
  private convert(tipoFase: TipoFase): TipoFase {
    const copy: TipoFase = Object.assign({}, tipoFase);
    return copy;
  }
}
