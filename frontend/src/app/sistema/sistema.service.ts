import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

import {Sistema} from './sistema.model';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { ResponseWrapper } from '../shared';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SistemaService {


    resourceUrl = environment.apiUrl + '/sistemas';

    findByOrganizacaoUrl = this.resourceUrl + '/organizacao';

    searchUrl = environment.apiUrl + '/_search/sistemas';

    fieldSearchSiglaUrl = environment.apiUrl + '/_searchSigla/sistemas';

    fieldSearchSistemaUrl = environment.apiUrl + '/_searchSistema/sistemas';

    fieldSearchOrganizacaoUrl = environment.apiUrl + '/_searchOrganizacao/sistemas';

    constructor(private http: HttpClient, private pageNotificationService: PageNotificationService) {
    }

    getLabel(label) {
        return label;
    }

    create(sistema: Sistema): Observable<Sistema> {
        const copy = this.convert(sistema);
        return this.http.post<Sistema>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    update(sistema: Sistema): Observable<Sistema> {
        const copy = this.convert(sistema);
        return this.http.put<Sistema>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    find(id: number): Observable<Sistema> {
        return this.http.get<Sistema>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get<ResponseWrapper>(url).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    findAllSystemOrg(orgId: number): Observable<Sistema[]> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get<Sistema[]>(url).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    dropDown(): Observable<Sistema[]> {
        return this.http.get<Sistema[]>(this.resourceUrl + '/drop-down').pipe(catchError((error: any) => {
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
            if (error) {
                const msgError = error.headers.get('x-abacoapp-error');
                if (msgError === 'error.not_found_system') {
                    this.pageNotificationService.addErrorMessage(this.getLabel(
                        'Cadastros.Sistema.Mensagens.msgOcorreuErroNaExclusaoDoSistema')
                    );
                } else if (msgError === 'error.analise_exists') {
                    this.pageNotificationService.addErrorMessage(this.getLabel(
                        'Cadastros.Sistema.Mensagens.msgSistemaVinculadoNaoPodeSerExcluido')
                    );
                }
                return Observable.throw(new Error(error.status));
            }
        }));
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
     * Convert a returned JSON object to Sistema.
     */
    private convertItemFromServer(json: any): Sistema {
        const entity: Sistema = Sistema.fromJSON(json);
        return entity;
    }

    /**
     * Convert a Sistema to a JSON which can be sent to the server.
     */
    private convert(sistema: Sistema): Sistema {
        const copy: Sistema = Object.assign(Sistema, sistema);
        return Sistema.toNonCircularJson(copy);
    }

}
