import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { FuncaoTransacao } from './funcao-transacao.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class FuncaoTransacaoService {

  resourceUrl = environment.apiUrl + '/funcao-transacaos';

  searchUrl = environment.apiUrl + '/_search/funcao-transacaos';

  constructor(private http: HttpService) {}

  create(funcaoTransacao: FuncaoTransacao): Observable<FuncaoTransacao> {
    const copy = this.convert(funcaoTransacao);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  update(funcaoTransacao: FuncaoTransacao): Observable<FuncaoTransacao> {
    const copy = this.convert(funcaoTransacao);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  find(id: number): Observable<FuncaoTransacao> {
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
   * Convert a returned JSON object to FuncaoTransacao.
   */
  private convertItemFromServer(json: any): FuncaoTransacao {
    const entity: FuncaoTransacao = Object.assign(new FuncaoTransacao(), json);
    return entity;
  }

  /**
   * Convert a FuncaoTransacao to a JSON which can be sent to the server.
   */
  private convert(funcaoTransacao: FuncaoTransacao): FuncaoTransacao {
    const copy: FuncaoTransacao = Object.assign({}, funcaoTransacao);
    return copy;
  }
}
