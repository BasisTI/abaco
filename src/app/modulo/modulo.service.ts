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

  constructor(private http: HttpService) { }

  create(modulo: Modulo, sistemaId?: number): Observable<Modulo> {
    const copy = this.convert(modulo);
    const moduloToBeCreated = this.linkToSistema(copy, sistemaId);
    return this.http.post(this.resourceUrl, moduloToBeCreated).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  private linkToSistema(modulo: Modulo, sistemaId: number) {
    if (sistemaId) {
      modulo.sistema = { id: sistemaId };
    }
    return modulo;
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
    return Modulo.fromJSON(json);
  }

  /**
   * Convert a Modulo to a JSON which can be sent to the server.
   */
  private convert(modulo: Modulo): Modulo {
    return Modulo.toNonCircularJson(modulo);
  }
}
