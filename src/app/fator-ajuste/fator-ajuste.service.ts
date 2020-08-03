import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { FatorAjuste } from './fator-ajuste.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FatorAjusteService {

  resourceUrl = environment.apiUrl + '/fator-ajustes';

  searchUrl = environment.apiUrl + '/_search/fator-ajustes';

  constructor(private http: HttpClient) {}

  create(fatorAjuste: FatorAjuste): Observable<FatorAjuste> {
    const copy = this.convert(fatorAjuste);
    copy.fator = copy.fator/100;
    return this.http.post<FatorAjuste>(this.resourceUrl, copy);
  }

  update(fatorAjuste: FatorAjuste): Observable<FatorAjuste> {
    const copy = this.convert(fatorAjuste);
    copy.fator = copy.fator/100;
    return this.http.put<FatorAjuste>(this.resourceUrl, copy);
  }

  find(id: number): Observable<FatorAjuste> {
    return this.http.get<FatorAjuste>(`${this.resourceUrl}/${id}`);
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

  /**
   * Convert a returned JSON object to FatorAjuste.
   */
  private convertItemFromServer(json: any): FatorAjuste {
    const entity: FatorAjuste = Object.assign(new FatorAjuste(), json);
    return entity;
  }

  /**
   * Convert a FatorAjuste to a JSON which can be sent to the server.
   */
  private convert(fatorAjuste: FatorAjuste): FatorAjuste {
    const copy: FatorAjuste = Object.assign({}, fatorAjuste);
    return copy;
  }
}
