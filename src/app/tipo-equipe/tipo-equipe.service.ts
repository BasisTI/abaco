import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { TipoEquipe } from './tipo-equipe.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class TipoEquipeService {

  resourceUrl = environment.apiUrl + '/tipo-equipes';

  searchUrl = environment.apiUrl + '/_search/tipo-equipes';

  constructor(private http: HttpService) {}

  create(tipoEquipe: TipoEquipe): Observable<TipoEquipe> {
    const copy = this.convert(tipoEquipe);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  update(tipoEquipe: TipoEquipe): Observable<TipoEquipe> {
    const copy = this.convert(tipoEquipe);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  find(id: number): Observable<TipoEquipe> {
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
   * Convert a returned JSON object to TipoEquipe.
   */
  private convertItemFromServer(json: any): TipoEquipe {
    const entity: TipoEquipe = Object.assign(new TipoEquipe(), json);
    return entity;
  }

  /**
   * Convert a TipoEquipe to a JSON which can be sent to the server.
   */
  private convert(tipoEquipe: TipoEquipe): TipoEquipe {
    const copy: TipoEquipe = Object.assign({}, tipoEquipe);
    return copy;
  }
}
