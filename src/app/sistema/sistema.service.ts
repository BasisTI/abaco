import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {Sistema} from './sistema.model';
import {ResponseWrapper, createRequestOption, JhiDateUtils, PageNotificationService} from '../shared';

@Injectable()
export class SistemaService {

    resourceUrl = environment.apiUrl + '/sistemas';

    findByOrganizacaoUrl = this.resourceUrl + '/organizacao';

    searchUrl = environment.apiUrl + '/_search/sistemas';

    constructor(private http: HttpService, private pageNotificationService: PageNotificationService) {}

    create(sistema: Sistema): Observable<Sistema> {
        const copy = this.convert(sistema);
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

    update(sistema: Sistema): Observable<Sistema> {
        const copy = this.convert(sistema);
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

    find(id: number): Observable<Sistema> {
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

    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get(url)
            .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    /**
     * Método responsável por popular a lista de sistemas da organização selecionada.
     */
    findAllSystemOrg(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get(url)
            .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
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

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

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
        const copy: Sistema = Object.assign({}, sistema);
        return Sistema.toNonCircularJson(copy);
    }

}
