import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Manual } from './manual.model';
import { Observable, throwError, pipe } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { createRequestOption, ResponseWrapper } from '../shared';

@Injectable()
export class ManualService {

    resourceName = '/manuals';
    resourceUrl = environment.apiUrl + this.resourceName;
    searchUrl = environment.apiUrl + '/_search/manual';

    constructor(
        private http: HttpClient,
        private pageNotificationService: PageNotificationService,
    ) {
    }

    getLabel(label) {
        let str: any;
        // this.translate.get(label).subscribe((res: string) => {
        //     str = res;
        // }).unsubscribe();
        return str;
    }

    create(manual: Manual): Observable<any> {
        const copy = this.convert(manual);
        return this.http.post<Manual>(this.resourceUrl, copy).pipe(
        catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
            if (error.status === 400) {
                this.pageNotificationService.addErrorMessage(`O nome digitado já existe!`);
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    update(manual: Manual): Observable<Manual> {
        const copy = this.convert(manual);
        return this.http.put<Manual>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    find(id: number): Observable<Manual> {  
        return this.http.get<Manual>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage('Você não possui permissão');
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    query(req?: any): Observable<Manual[]> {
        const options = createRequestOption(req);
        return this.http.get<Manual[]>(this.resourceUrl).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage('Você não possui permissão');
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    dropdown(): Observable<ResponseWrapper> {
        return this.http.get<ResponseWrapper>(this.resourceUrl + '/dropdown').
           pipe(catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage('Você não possui permissão.');
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${id}`).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
                if (error._body == "contratoexists") {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.Manual.Mensagens.msgManualNaoPodeSerExcluido'));
                    return Observable.throw(new Error(error.status));
                } 
                if (error._body == "analiseexists") {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.Manual.Mensagens.msgManualEstaVinculadoUmaAnalise'));
                    return Observable.throw(new Error(error.status));
                }
                if (error._body == "fatorajusteexists") {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.Manual.Mensagens.msgManualVinculadoFatorAjusteVerifiqueFuncoesDadosOuFuncoesTransacoes'));
                    return Observable.throw(new Error(error.status));
                }
            }
        ));
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
     * Convert a returned JSON object to Manual.
     */
    private convertItemFromServer(json: any): Manual {
        const entity = new Manual();
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
