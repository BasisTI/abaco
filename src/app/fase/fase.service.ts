import { DataTable } from 'primeng/primeng';
import { FaseFilter } from './model/fase.filter';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Fase } from './model/fase.model';
import { PageNotificationService } from '../shared';
import { TranslateService } from '@ngx-translate/core';
import { Page } from '../util/page';
import { RequestUtil } from '../util/requestUtil';

@Injectable()
export class FaseService {

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

    create(fase: Fase): Observable<boolean> {
        const copy = this.convert(fase);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.ok;
        }).catch((error: any) => this.handlerError(error));
    }

    handlerError(error: any):Observable<any> {
        switch (error.status) {
            case 400:
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.RegistroCadastrado'));
                return Observable.throw(new Error(error.status));

            case 403:
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
        }
    }

    find(id: number): Observable<Fase> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => this.handlerError(error));
    }

    query(filtro?: FaseFilter, datatable?: DataTable): Observable<Fase[]> {
        const options = {params: RequestUtil.getRequestParams(datatable) };
        if (!filtro) {
            filtro = new FaseFilter();
        }
        return this.http.post(this.searchUrl, filtro, options).map((res: Response) => {
            const tiposFaseJson: Page<Fase> = res.json();
            const tiposFase: Fase[] = [];
            tiposFaseJson.content.forEach(fase => {
                tiposFase.push( this.convertItemFromServer(fase) );
            });
            return tiposFase;
        },(error: any) => this.handlerError(error));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
            if (error.status === 400) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Fase.Mensagens.msgNaoEPossivelExcluirRegistrosVinculados'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    private convertItemFromServer(json: any): Fase {
        const entity: Fase = Object.assign(new Fase(), json);
        return entity;
    }

    private convert(tipoFase: Fase): Fase {
        const copy: Fase = Object.assign({}, tipoFase);
        return copy;
    }
}
