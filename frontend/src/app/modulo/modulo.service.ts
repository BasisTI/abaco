import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { createRequestOption, ResponseWrapper } from '../shared';
import { Modulo } from './modulo.model';

@Injectable()
export class ModuloService {

  resourceUrl = environment.apiUrl + '/modulos';

  searchUrl = environment.apiUrl + '/_search/modulos';

  constructor(private http: HttpClient, private pageNotificationService: PageNotificationService) { }

  getLabel(label) {
    return label;
  }

  create(modulo: Modulo, sistemaId?: number): Observable<Modulo> {
    const copy = this.convert(modulo);
    const moduloToBeCreated = this.linkToSistema(copy, sistemaId);
    return this.http.post<Modulo>(this.resourceUrl, moduloToBeCreated).pipe(catchError((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
        return Observable.throw(new Error(error.status));
      }
      switch (error.headers.get('x-abacoapp-error')) {
        case 'error.moduloexists':
          this.pageNotificationService.addErrorMessage(this.getLabel('Este módulo já existe neste sistema.'));
          return Observable.throw(new Error(error.status));
      }
    }));
  }

  private linkToSistema(modulo: Modulo, sistemaId: number) {
    if (sistemaId) {
      modulo.sistema = { id: sistemaId };
    }
    return modulo;
  }

  update(modulo: Modulo): Observable<Modulo> {
    const copy = this.convert(modulo);
    return this.http.put<Modulo>(this.resourceUrl, copy).pipe(catchError((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
        return Observable.throw(new Error(error.status));
      }
    }));
  }

  find(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
        return Observable.throw(new Error(error.status));
      }
    }));
  }

  query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http.get<ResponseWrapper>(this.resourceUrl).pipe(catchError((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
        return Observable.throw(new Error(error.status));
      }
    }));
  }

  delete(id: number): Observable<Response> {
    return this.http.delete<Response>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
        return Observable.throw(new Error(error.status));
      }
    }));
  }

  findByFuncionalidade(id: number): Observable<Modulo> {
    return this.http.get<Modulo>(`${this.resourceUrl}/funcionalidade/${id}`).pipe(catchError((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
        return Observable.throw(new Error(error.status));
      }
    }));
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
