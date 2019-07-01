import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {Funcionalidade} from './funcionalidade.model';
import {ResponseWrapper, createRequestOption, JhiDateUtils, BaseEntity} from '../shared';
import {Modulo} from '../modulo/index';
import { DeferObservable } from 'rxjs/observable/DeferObservable';

@Injectable()
export class FuncionalidadeService {

    resourceUrl = environment.apiUrl + '/funcionalidades';

    searchUrl = environment.apiUrl + '/_search/funcionalidades';

    constructor(private http: HttpService) {
    }

    create(funcionalidade: Funcionalidade, moduloId?: number): Observable<Funcionalidade> {
        const copy = this.convert(funcionalidade);
        const funcionalidadeToBeCreated = this.linkToModulo(copy, moduloId);
        return this.http.post(this.resourceUrl, funcionalidadeToBeCreated).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).debounceTime(5000);
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
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Funcionalidade> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    findFuncionalidadesDropdownByModulo(id: number): Observable<Funcionalidade[]> {
        return this.http.get(`${this.resourceUrl}/drop-down/${id}`).map((res: Response) => {
          const jsonResponse = res.json();
          return this.convertListFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                return Observable.throw(new Error(error.status));
            }
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
}
