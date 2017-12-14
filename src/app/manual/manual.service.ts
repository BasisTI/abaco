import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Manual } from './manual.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class ManualService {

  resourceUrl = environment.apiUrl + '/manuals';

  searchUrl = environment.apiUrl + '/_search/manuals';

  constructor(private http: HttpService) {}

  create(manual: Manual): Observable<Manual> {
    const copy = this.convert(manual);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  update(manual: Manual): Observable<Manual> {
    const copy = this.convert(manual);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  find(id: number): Observable<Manual> {
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
   * Convert a returned JSON object to Manual.
   */
  private convertItemFromServer(json: any): Manual {
    const entity: Manual = Object.assign(new Manual(), json);
    return entity;
  }

  /**
   * Convert a Manual to a JSON which can be sent to the server.
   */
  private convert(manual: Manual): Manual {
    const copy: Manual = Object.assign({}, manual);
    return copy;
  }
}
