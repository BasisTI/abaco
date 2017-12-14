import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Organizacao } from './organizacao.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class OrganizacaoService {

  resourceUrl = environment.apiUrl + '/organizacaos';

  searchUrl = environment.apiUrl + '/_search/organizacaos';

  constructor(private http: HttpService) {}

  create(organizacao: Organizacao): Observable<Organizacao> {
    const copy = this.convert(organizacao);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  update(organizacao: Organizacao): Observable<Organizacao> {
    const copy = this.convert(organizacao);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  find(id: number): Observable<Organizacao> {
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
   * Convert a returned JSON object to Organizacao.
   */
  private convertItemFromServer(json: any): Organizacao {
    const entity: Organizacao = Object.assign(new Organizacao(), json);
    return entity;
  }

  /**
   * Convert a Organizacao to a JSON which can be sent to the server.
   */
  private convert(organizacao: Organizacao): Organizacao {
    const copy: Organizacao = Object.assign({}, organizacao);
    return copy;
  }
}
