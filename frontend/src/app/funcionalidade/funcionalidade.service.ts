import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

import {Funcionalidade} from './funcionalidade.model';
import {ResponseWrapper, createRequestOption, JhiDateUtils, BaseEntity} from '../shared';
import {Modulo} from '../modulo/index';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PageNotificationService } from '@nuvem/primeng-components';

@Injectable()
export class FuncionalidadeService {

    resourceUrl = environment.apiUrl + '/funcionalidades';

    searchUrl = environment.apiUrl + '/_search/funcionalidades';

    constructor(private http: HttpClient, private pageNotificationService: PageNotificationService) {
    }

    create(funcionalidade: Funcionalidade, moduloId?: number): Observable<Funcionalidade> {
        const copy = this.convert(funcionalidade);
        const funcionalidadeToBeCreated = this.linkToModulo(copy, moduloId);
        return this.http.post<Funcionalidade>(this.resourceUrl, funcionalidadeToBeCreated).pipe(catchError((error: any) => {
            if (error.status === 403) {
              this.pageNotificationService.addErrorMessage('Você não possui permissão!');
              return Observable.throw(new Error(error.status));
            }
            switch (error.headers.get('x-abacoapp-error')) {
              case 'error.funcionalidadeexists':
                this.pageNotificationService.addErrorMessage("Esta funcionalidade já existe neste módulo.");
                return Observable.throw(new Error(error.status));
            }
          }));
    }

    private linkToModulo(funcionalidade: Funcionalidade, moduloId: number) {
        if (moduloId && !funcionalidade.modulo) {
            const modulo: BaseEntity = {id: moduloId};
            funcionalidade.modulo = modulo as Modulo;
        }
        return funcionalidade;
    }

    update(funcionalidade: Funcionalidade): Observable<Funcionalidade> {
        const copy = this.convert(funcionalidade);
        return this.http.put<Funcionalidade>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
              this.pageNotificationService.addErrorMessage('Você não possui permissão!');
              return Observable.throw(new Error(error.status));
            }
          }));
    }

    find(id: number): Observable<Funcionalidade> {
        return this.http.get<Funcionalidade>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
              this.pageNotificationService.addErrorMessage('Você não possui permissão!');
              return Observable.throw(new Error(error.status));
            }
          }));
    }

    findFuncionalidadesDropdownByModulo(id: number): Observable<Funcionalidade[]> {
        return this.http.get<Funcionalidade[]>(`${this.resourceUrl}/drop-down/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
              this.pageNotificationService.addErrorMessage('Você não possui permissão!');
              return Observable.throw(new Error(error.status));
            }
          }));
      }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get<ResponseWrapper>(this.resourceUrl).pipe(catchError((error: any) => {
            if (error.status === 403) {
              this.pageNotificationService.addErrorMessage('Você não possui permissão!');
              return Observable.throw(new Error(error.status));
            }
          }));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${id}`);
    }

    // private convertResponse(res: Response): ResponseWrapper {
    //     const jsonResponse = res.json();
    //     const result = [];
    //     for (let i = 0; i < jsonResponse.length; i++) {
    //         result.push(this.convertItemFromServer(jsonResponse[i]));
    //     }
    //     return new ResponseWrapper(res.headers, result, res.status);
    // }

    /**
     * Convert a returned JSON object to Funcionalidade.
     */
    private convertItemFromServer(json: any): Funcionalidade {
        const entity: Funcionalidade = Object.assign(new Funcionalidade(), json);
        return entity;
    }

    private convertListFromServer(json: any): Funcionalidade[] {
        const fun: Funcionalidade[] = [];
        for (let i = 0; i < json.length; i++ ) {
            const entity: Funcionalidade = Object.assign(new Funcionalidade(), json[i]);
            fun.push(entity);
        }
        return fun;
    }

    /**
     * Convert a Funcionalidade to a JSON which can be sent to the server.
     */
    private convert(funcionalidade: Funcionalidade): Funcionalidade {
        const copy: Funcionalidade = Object.assign({}, funcionalidade);
        return copy;
    }

    getTotalFunction(id: number): Observable<Number> {
      return this.http.get<Number>(`${this.resourceUrl}/total-functions/${id}`);
    }

    migrarFuncoes(idEditFuncionalidade: number, idMigrarFuncionalidade: number): Observable<void>{
        let params: HttpParams = new HttpParams();
        params = params.append("idEdit", ""+idEditFuncionalidade.toString());
        params = params.append("idMigrar", idMigrarFuncionalidade.toString());
        return this.http.get<void>(`${this.resourceUrl}/migrar`, {params});
    }
}
