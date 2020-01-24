import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {Sistema} from './sistema.model';
import {PageNotificationService, ResponseWrapper} from '../shared';
import {BlockUI, NgBlockUI} from 'ng-block-ui';

@Injectable()
export class SistemaService {

    @BlockUI() blockUI: NgBlockUI;

    resourceUrl = environment.apiUrl + '/sistemas';

    findByOrganizacaoUrl = this.resourceUrl + '/organizacao';

    searchUrl = environment.apiUrl + '/_search/sistemas';

    fieldSearchSiglaUrl = environment.apiUrl + '/_searchSigla/sistemas';

    fieldSearchSistemaUrl = environment.apiUrl + '/_searchSistema/sistemas';

    fieldSearchOrganizacaoUrl = environment.apiUrl + '/_searchOrganizacao/sistemas';

    constructor(private http: HttpService, private pageNotificationService: PageNotificationService, private translate: TranslateService) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    create(sistema: Sistema): Observable<Sistema> {
        const copy = this.convert(sistema);
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

    update(sistema: Sistema): Observable<Sistema> {
        const copy = this.convert(sistema);
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

    find(id: number): Observable<Sistema> {
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

    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get(url)
            .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    /**
     * Método responsável por popular a lista de sistemas da organização selecionada.
     */
    findAllSystemOrg(orgId: number): Observable<ResponseWrapper> {
        this.blockUI.start();
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get(url)
            .map((response: Response) => function () {
                this.blockUI.stop();
                this.convertResponse(response);
            })
            .catch((error: any) => {
                this.blockUI.stop();
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            }).finally(() => this.blockUI.stop());
    }

    dropDown(): Observable<ResponseWrapper> {
        return this.http.get(this.resourceUrl + '/drop-down')
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
            if (error) {
                const msgError = error.headers.get('x-abacoapp-error');
                if (msgError === 'error.not_found_system') {
                    this.pageNotificationService.addErrorMsg(this.getLabel(
                        'Cadastros.Sistema.Mensagens.msgOcorreuErroNaExclusaoDoSistema')
                    );
                } else if (msgError === 'error.analise_exists') {
                    this.pageNotificationService.addErrorMsg(this.getLabel(
                        'Cadastros.Sistema.Mensagens.msgSistemaVinculadoNaoPodeSerExcluido')
                    );
                }
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
        const copy: Sistema = Object.assign(Sistema, sistema);
        return Sistema.toNonCircularJson(copy);
    }

}
