import { Funcionalidade } from './../funcionalidade/funcionalidade.model';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Modulo } from './modulo.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils, PageNotificationService } from '../shared';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ModuloService {

  resourceUrl = environment.apiUrl + '/modulos';

  searchUrl = environment.apiUrl + '/_search/modulos';

  constructor(private http: HttpService, private pageNotificationService: PageNotificationService, private translate: TranslateService) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

  create(modulo: Modulo, sistemaId?: number): Observable<Modulo> {
    const copy = this.convert(modulo);
    const moduloToBeCreated = this.linkToSistema(copy, sistemaId);
    return this.http.post(this.resourceUrl, moduloToBeCreated).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    }).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    }).delay(1000);
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
    }).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
  }

  find(id: number): Observable<Modulo> {
    return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    }).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl, options)
      .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
        if (error.status === 403) {
          this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
          return Observable.throw(new Error(error.status));
        }
      });
  }

  delete(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
  }

  findByFuncionalidade(id: number): Observable<Modulo> {
    return this.http.get(`${this.resourceUrl}/funcionalidade/${id}`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    }).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
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
