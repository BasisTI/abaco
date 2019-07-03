import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';
import { UploadService } from '../upload/upload.service';

import { Manual } from './manual.model';
import { ResponseWrapper, createRequestOption, JSONable, PageNotificationService } from '../shared';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class ManualService {

    resourceName = '/manuals';
    resourceUrl = environment.apiUrl + this.resourceName;
    searchUrl = environment.apiUrl + '/_search/manual';
    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpService,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    create(manual: Manual): Observable<any> {
        const copy = this.convert(manual);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
            if (error.status === 400) {
                this.pageNotificationService.addErrorMsg(`O nome digitado já existe!`);
                return Observable.throw(new Error(error.status));
            }
        });
    }

    update(manual: Manual): Observable<Manual> {
        const copy = this.convert(manual);
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

    find(id: number): Observable<Manual> {
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

    queryDropdown(): Observable<ResponseWrapper> {
        return this.http.get(this.resourceUrl + '/dropdown')
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
            if (error._body == "contratoexists") {
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.Mensagens.msgManualNaoPodeSerExcluido'));
                this.blockUI.stop();
                return Observable.throw(new Error(error.status));
            } 
            if (error._body == "analiseexists") {
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.Mensagens.msgManualEstaVinculadoUmaAnalise'));
                this.blockUI.stop();
                return Observable.throw(new Error(error.status));
            }
            if (error._body == "fatorajusteexists") {
                this.pageNotificationService.addErrorMsg(this.getLabel('Cadastros.Manual.Mensagens.msgManualVinculadoFatorAjusteVerifiqueFuncoesDadosOuFuncoesTransacoes'));
                this.blockUI.stop();
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
     * Convert a returned JSON object to Manual.
     */
    private convertItemFromServer(json: any): Manual {
        const entity: JSONable<Manual> = new Manual();
        return entity.copyFromJSON(json);
    }

    /**
     * Convert a Manual to a JSON which can be sent to the server.
     */
    private convert(manual: Manual): Manual {
        const copy: Manual = manual.toJSONState();
        return copy;
    }
}
