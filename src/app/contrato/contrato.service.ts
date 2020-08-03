import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { Contrato } from './contrato.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';
import { Organizacao } from '../organizacao';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ContratoService {

  resourceUrl = environment.apiUrl + '/contratoes';

  searchUrl = environment.apiUrl + '/_search/contratoes';

  constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {}

  create(contrato: Contrato): Observable<Contrato> {
    const copy = this.convert(contrato);
    return this.http.post<Contrato>(this.resourceUrl, copy);
  }

  update(contrato: Contrato): Observable<Contrato> {
    const copy = this.convert(contrato);
    return this.http.put<Contrato>(this.resourceUrl, copy);
  }

  findAllContratoesByOrganization(org: Organizacao): Observable<Contrato[]> {
    return this.http.post<Contrato[]>(`${this.resourceUrl}/organizations`, org);
  }

  find(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(`${this.resourceUrl}/${id}`);
  }

  // query(req?: any): Observable<ResponseWrapper> {
  //   const options = createRequestOption(req);
  //   return this.http.get(this.resourceUrl, options)
  //     .map((res: Response) => this.convertResponse(res));
  // }

  delete(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.resourceUrl}/${id}`);
  }

  // private convertResponse(res: Response): ResponseWrapper {
  //   const jsonResponse = res.json();
  //   const result = [];
  //   for (let i = 0; i < jsonResponse.length; i++) {
  //     result.push(this.convertItemFromServer(jsonResponse[i]));
  //   }
  //   return new ResponseWrapper(res.headers, result, res.status);
  // }

  // /**
  //  * Convert a returned JSON object to Contrato.
  //  */
  // private convertItemFromServer(json: any): Contrato {
  //   return this.genericService.convertJsonToObject(json, new Contrato());
  // }

  /**
   * Convert a Contrato to a JSON which can be sent to the server.
   */
  private convert(contrato: Contrato): Contrato {
    const copy: Contrato = Object.assign({}, contrato);
    return copy;
  }
}
