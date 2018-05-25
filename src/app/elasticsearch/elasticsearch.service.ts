import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';

@Injectable()
export class ElasticSearchService {

  resourceUrl = environment.apiUrl + '/elasticsearch/index';

  constructor(private http: HttpService) {}

  reindexAll(): Observable<any> {
    return this.http.post(this.resourceUrl, null).map(
        (res: Response) => {
            return res.json();
        });
  }

}
