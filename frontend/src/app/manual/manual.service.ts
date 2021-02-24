import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Manual } from './manual.model';
import { Observable, throwError, pipe } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { createRequestOption, ResponseWrapper } from '../shared';
import { Upload } from '../upload/upload.model';


import { BlockUiService } from '@nuvem/angular-base';

@Injectable()
export class ManualService {

    resourceName = '/manuals';
    resourceUrl = environment.apiUrl + this.resourceName;
    searchUrl = environment.apiUrl + '/_search/manual';
    relatoriosUrl = environment.apiUrl + '/manuals';
    relatorioFatorAjusteUrl = environment.apiUrl + '/relatorioPdfArquivoFatorAjuste';

    constructor(
        private http: HttpClient,
        private pageNotificationService: PageNotificationService,
        private blockUiService: BlockUiService
    ) {
    }

    getLabel(label) {
        let str: any;
        // this.translate.get(label).subscribe((res: string) => {
        //     str = res;
        // }).unsubscribe();
        return str;
    }

    create(manual: Manual, files: File[]): Observable<any> {
        let body = new FormData();

        if (files) {
            for (let i = 0; i < files.length; i++) {
                body.append('file', files[i]);
            }
        }

        const json = JSON.stringify(manual);
        const blob = new Blob([json], {
            type: 'application/json'
        });

        body.append('manual', blob);


        return this.http.post<Manual>(this.resourceUrl, body).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
                if (error.status === 400) {
                    this.pageNotificationService.addErrorMessage(`O nome digitado já existe!`);
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    update(manual: Manual, files: File[]): Observable<Manual> {
        let body = new FormData();
        if (files) {
            for (let i = 0; i < files.length; i++) {
                body.append('file', files[i]);
            }
        }

        const json = JSON.stringify(manual);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        body.append('manual', blob);
        return this.http.put<Manual>(this.resourceUrl, body).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    clonar(manual: Manual): Observable<any> {
        return this.http.post<Manual>(`${this.resourceUrl}/clonar`, manual).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage('Você não possui permissão');
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

    getFiles(id: number): Observable<Upload[]> {
        return this.http.get<Upload[]>(`${this.resourceUrl}/arquivos/${id}`).pipe(catchError((error: any) => {
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
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
                if (error.error.message == "ContratoRelacionado") {
                    this.pageNotificationService.addErrorMessage('Manual relacionado com contrato(s)');
                    return Observable.throw(new Error(error.status));
                }
                if (error.error.message == "AnaliseRelacionada") {
                    this.pageNotificationService.addErrorMessage('Manual relacionado com análise(s)');
                    return Observable.throw(new Error(error.status));
                }
                if (error.error.message == "FatorDeAjusteRelacionado") {
                    this.pageNotificationService.addErrorMessage('Manual relacionado com fatore(s) de reajuste');
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

    public geraRelatorioPdfBrowserFatorAjuste(id: number): Observable<string> {
        this.blockUiService.show();
        this.http.request('get', `${this.relatorioFatorAjusteUrl}/${id}`, {
            responseType: 'blob',
        }).subscribe(
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response], { type: mediaType });
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise.pdf';
                anchor.href = fileURL;
                window.open(fileURL, '_blank', '');
                this.blockUiService.hide();
                return null;
            });
        return null;
    }
}
