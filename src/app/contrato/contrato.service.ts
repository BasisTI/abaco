import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Contrato } from './contrato.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';
import { GenericService } from '../util/service/generic.service';

@Injectable()
export class ContratoService {

  resourceUrl = environment.apiUrl + '/contratoes';

  searchUrl = environment.apiUrl + '/_search/contratoes';

  constructor(private http: HttpService, private dateUtils: JhiDateUtils, private genericService: GenericService) {}

  create(contrato: Contrato): Observable<Contrato> {
    const copy = this.convert(contrato);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  update(contrato: Contrato): Observable<Contrato> {
    const copy = this.convert(contrato);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  find(id: number): Observable<Contrato> {
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
   * Convert a returned JSON object to Contrato.
   */
  private convertItemFromServer(json: any): Contrato {
    return this.genericService.convertJsonToObject(json, new Contrato());
  }

  /**
   * Convert a Contrato to a JSON which can be sent to the server.
   */
  private convert(contrato: Contrato): Contrato {
    const copy: Contrato = Object.assign({}, contrato);
    return copy;
  }
}
