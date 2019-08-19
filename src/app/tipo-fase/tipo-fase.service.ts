import { TipoFaseFilter } from './model/tipoFase.filter';
import { RequestOptions } from '@angular/http';
import { Pageable } from './../util/pageable.util';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { TipoFase } from './model/tipo-fase.model';
import { PageNotificationService } from '../shared';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '../util/page';

@Injectable()
export class TipoFaseService {

    resourceUrl = environment.apiUrl + '/fases';
    searchUrl = environment.apiUrl + '/search/fases';

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
        }).catch((error: any) => this.handlerError(error));
    }

    handlerError(error: any):Observable<TipoFase> {
        switch (error.status) {
            case 400:
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.RegistroCadastrado'));
                return Observable.throw(new Error(error.status));

            case 403:
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
        }
    }

    /**
     * Find object TipoFase.
     */
    find(id: number): Observable<TipoFase> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => this.handlerError(error));
    }

    /**
     * Find Query object TipoFase.
     */
    query(filtro?: TipoFaseFilter ,page: Pageable = new Pageable()): Observable<TipoFase[]> {
        const options =  new RequestOptions({params: Object.assign(page)});
        return this.http.post(this.searchUrl, filtro, options).map((res: Response) => {
            const tiposFaseJson: Page<TipoFase> = res.json();
            const tiposFase: TipoFase[] = [];
            tiposFaseJson.content.forEach(fase => {
                tiposFase.push( this.convertItemFromServer(fase) );
            });
            return tiposFase;
        },(error: any) => this.handlerError(error));
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
