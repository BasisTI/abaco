import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Organizacao } from './organizacao.model';
import {ResponseWrapper, createRequestOption, JhiDateUtils, JSONable, PageNotificationService} from '../shared';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class OrganizacaoService {

  resourceName = '/organizacaos';

  resourceUrl = environment.apiUrl + this.resourceName;

  searchUrl = environment.apiUrl + '/_search' + this.resourceName;

  findActive = environment.apiUrl + this.resourceName + '/active';

  constructor(
    private http: HttpService,
    private uploadService: UploadService,
    private pageNotificationService: PageNotificationService
  ) {}

  create(organizacao: Organizacao): Observable<any> {
    const copy = this.convertToJSON(organizacao);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertFromJSON(jsonResponse);
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  update(organizacao: Organizacao): Observable<Organizacao> {
    const copy = this.convertToJSON(organizacao);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertFromJSON(jsonResponse);
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  find(id: number): Observable<Organizacao> {
    return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
      const jsonResponse = res.json();
      console.log('find', jsonResponse);
      return this.convertFromJSON(jsonResponse);
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
      const options = createRequestOption(req);
      return this.http.get(this.resourceUrl, options)
          .map((res: Response) => this.convertResponseToResponseWrapper(res)).catch((error: any) => {
              if (error.status === 403) {
                  this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                  return Observable.throw(new Error(error.status));
              }
          });
  }

    searchActiveOrganizations(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl + '/ativas', options)
            .map((res: Response) => this.convertResponseToResponseWrapper(res)).catch((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                    return Observable.throw(new Error(error.status));
                }
            });
    }

  delete(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  findActiveOrganizations() {
    return this.http.get(this.findActive).map((response: Response) => {
      return response.json();
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  private convertResponseToResponseWrapper(res: Response): ResponseWrapper {
    const jsonResponse = res.json();
    const result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertFromJSON(jsonResponse[i]));
    }
    return new ResponseWrapper(res.headers, result, res.status);
  }

  private convertFromJSON(json: any): Organizacao {
    const entity: JSONable<Organizacao> = new Organizacao();
    return entity.copyFromJSON(json);
  }

  private convertToJSON(organizacao: Organizacao): Organizacao {
    const copy: Organizacao = Object.assign({}, organizacao);
    return copy;
  }
}
