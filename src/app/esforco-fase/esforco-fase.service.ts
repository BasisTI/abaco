import { Injectable } from '@angular/core';
import { HttpService } from '@basis/angular-components';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { Response } from '@angular/http';
import { EsforcoFase } from '../esforco-fase';

@Injectable()
export class EsforcoFaseService {

  resourceUrl = environment.apiUrl + '/esforco-fases';
  constructor(private http: HttpService) { }


  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl, options)
      .map((res: Response) => this.convertResponse(res));
  }

  private convertResponse(res: Response): ResponseWrapper {
    const jsonResponse = res.json();
    const result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return new ResponseWrapper(res.headers, result, res.status);
  }

  private convertItemFromServer(json: any): EsforcoFase {
    const entity = Object.assign(new EsforcoFase(), json);
    return entity;
  }
}
