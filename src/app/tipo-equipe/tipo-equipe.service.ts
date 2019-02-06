import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { TipoEquipe } from './tipo-equipe.model';
import {ResponseWrapper, createRequestOption, JhiDateUtils, PageNotificationService} from '../shared';
import { BlockUI } from 'ng-block-ui';

@Injectable()
export class TipoEquipeService {

  resourceUrl = environment.apiUrl + '/tipo-equipes';

  findByOrganizacaoAndUserUrl = this.resourceUrl + '/current-user';
  findByOrganizacaoUrl = this.resourceUrl + '/organizacoes';
  findAllCompartilhaveisUrl = this.resourceUrl + '/compartilhar';

  searchUrl = environment.apiUrl + '/_search/tipo-equipes';

  constructor(private http: HttpService, private pageNotificationService: PageNotificationService) {}

  create(tipoEquipe: TipoEquipe): Observable<TipoEquipe> {
    const copy = this.convert(tipoEquipe);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  update(tipoEquipe: TipoEquipe): Observable<TipoEquipe> {
    const copy = this.convert(tipoEquipe);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  find(id: number): Observable<TipoEquipe> {
    return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    }).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  /**
   * Método responsável por recuperar todas as equipes pelo ID da organização.
   * @param orgId
   */
  findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
    const url = `${this.findByOrganizacaoUrl}/${orgId}`;
    return this.http.get(url).map((res: Response) => this.convertResponse(res)).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  /**
   * Método responsável por recuperar todas as equipes pelo ID da organização.
   * @param orgId
   */
  findAllEquipesByOrganizacaoIdAndLoggedUser(orgId: number): Observable<ResponseWrapper> {
    const url = `${this.findByOrganizacaoAndUserUrl}/${orgId}`;
    return this.http.get(url).map((res: Response) => this.convertResponse(res)).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  /**
   * Método responsável por recuperar todas as equipes compartilhaveis ID da organização, analise e equipe.
   * @param orgId
   */
  findAllCompartilhaveis(orgId, analiseId, equipeId: number): Observable<ResponseWrapper> {
    const url = `${this.findAllCompartilhaveisUrl}/${orgId}/${analiseId}/${equipeId}`;
    return this.http.get(url).map((res: Response) => this.convertResponse(res)).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl, options).map((res: Response) => this.convertResponse(res)).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg('Você não possui permissão!');
            return Observable.throw(new Error(error.status));
        }
    });
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
