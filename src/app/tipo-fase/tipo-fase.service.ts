import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { TipoFase } from './tipo-fase.model';
import { ResponseWrapper, createRequestOption, PageNotificationService } from '../shared';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TipoFaseService {

    resourceUrl = environment.apiUrl + '/fases';
    searchUrl = environment.apiUrl + '/_search/fases';

    constructor(private http: HttpService, private pageNotificationService: PageNotificationService, private translate: TranslateService) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    /**
     * Create object TipoFase.
     */
    create(tipoFase: TipoFase): Observable<TipoFase> {
        const copy = this.convert(tipoFase);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    /**
     * Update object TipoFase.
     */
    update(tipoFase: TipoFase): Observable<TipoFase> {
        const copy = this.convert(tipoFase);
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

    /**
     * Find object TipoFase.
     */
    find(id: number): Observable<TipoFase> {
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

    /**
     * Find Query object TipoFase.
     */
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

    /**
     * Delete object TipoFase.
     */
    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
            if (error.status === 500) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.TipoFase.Mensagens.msgNaoEPossivelExcluirRegistrosVinculados'));
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
     * Convert a returned JSON object to TipoFase.
     */
    private convertItemFromServer(json: any): TipoFase {
        const entity: TipoFase = Object.assign(new TipoFase(), json);
        return entity;
    }

    /**
     * Convert a TipoFase to a JSON which can be sent to the server.
     */
    private convert(tipoFase: TipoFase): TipoFase {
        const copy: TipoFase = Object.assign({}, tipoFase);
        return copy;
    }
}
