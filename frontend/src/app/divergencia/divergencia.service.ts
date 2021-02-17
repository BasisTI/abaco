import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlockUiService } from '@nuvem/angular-base';
import { PageNotificationService } from '@nuvem/primeng-components';
import { LazyLoadEvent } from 'primeng';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Divergencia } from '.';
import { environment } from '../../environments/environment';
import { Analise } from '../analise';
import { Resumo } from '../analise/analise-resumo/resumo.model';
import { createRequestOption, ResponseWrapper } from '../shared';
import { Status } from '../status/status.model';


@Injectable()
export class DivergenciaService {

    resourceUrl = environment.apiUrl + '/divergencia';

    relatoriosUrl = environment.apiUrl + '/relatorioPdfBrowser';

    findByOrganizacaoUrl = this.resourceUrl + '/organizacao';

    findCompartilhadaByAnaliseUrl = environment.apiUrl + '/compartilhada';

    relatorioAnaliseUrl = this.resourceUrl + '/relatorioPdfArquivo';

    relatoriosDetalhadoUrl = this.resourceUrl + '/downloadPdfDetalhadoBrowser';

    relatorioExcelUrl = this.resourceUrl + '/downloadRelatorioExcel';

    searchUrl = environment.apiUrl + '/_search/analises';

    relatoriosBaselineUrl = environment.apiUrl + '/downloadPdfBaselineBrowser';

    relatorioContagemUrl = environment.apiUrl + '/relatorioContagemPdf';

    clonarAnaliseUrl = this.resourceUrl + '/clonar/';

    resourceResumoUrl = environment.apiUrl + '/vw-resumo';

    analiseResourceUrl = environment.apiUrl + '/analises';


    constructor(
        private http: HttpClient,
        private pageNotificationService: PageNotificationService,
        private blockUiService: BlockUiService,
        ) {
    }

    getLabel(label) {
        return label;
    }

    public update(analise: Divergencia): Observable<Divergencia> {
        const copy = this.convert(analise);
        return this.http.put<Divergencia>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    public block(analise: Analise): Observable<Analise> {
        const copy = analise;
        return this.http.put<Analise>(`${this.analiseResourceUrl}/${copy.id}/block`, copy).pipe(catchError((error: any) => {
            switch (error.status) {
                case 400: {
                    if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.notadmin') {
                        this.pageNotificationService.addErrorMessage(
                            this.getLabel('Somente administradores podem bloquear/desbloquear análises!')
                        );
                    }
                    break;
                }
                case 403: {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    break;
                }
            }
            return Observable.throw(new Error(error.status));
        }));
    }

    public gerarRelatorioPdfArquivo(id: number) {
        window.open(`${this.relatorioAnaliseUrl}/${id}`);
    }

    public geraRelatorioPdfBrowser(id: number): Observable<string> {
        this.blockUiService.show();
        this.http.request('get', `${this.relatoriosUrl}/${id}`, {
            responseType: 'blob',
        }).subscribe( 
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response], {type: mediaType});
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

    /**
     *
     */
    public geraRelatorioPdfDetalhadoBrowser(id: Number): Observable<string> {
        this.blockUiService.show();
        this.http.request('get', `${this.relatoriosDetalhadoUrl}/${id}`, {
            responseType: 'blob',
        }).pipe(catchError((error: any) => {
            if (error.status === 500) {
                this.blockUiService.hide();
                this.pageNotificationService.addErrorMessage(this.getLabel('Erro ao gerar relatório'));
                return Observable.throw(new Error(error.status));
            }
        })).subscribe(
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response], {type: mediaType});
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise.pdf';
                anchor.href = fileURL;
                document.body.appendChild(anchor);
                anchor.click();
                this.blockUiService.hide();
                return null;
            });
        return null;
    }

    /**
     *
     */
    public gerarRelatorioExcel(id: Number): Observable<string> {
        this.blockUiService.show();
        this.http.request('get',`${this.relatorioExcelUrl}/${id}`, {
            responseType: 'blob',
        }).pipe(catchError((error: any) => {
            if (error.status === 500) {
                this.blockUiService.hide();
                this.pageNotificationService.addErrorMessage(this.getLabel('Erro ao gerar relatório'));
                return Observable.throw(new Error(error.status));
            }
        })).subscribe(
            (response) => {
                const mediaType = 'application/vnd.ms-excel';
                const blob = new Blob([response], {type: mediaType});
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise.xls';
                anchor.href = fileURL;
                document.body.appendChild(anchor);
                anchor.click();
                this.blockUiService.hide();
                return null;
            });
        return null;
    }

    /**
     *
     */
    public geraBaselinePdfBrowser(): Observable<string> {
        this.blockUiService.show();
        this.http.request('get', `${this.relatoriosBaselineUrl}`, {
            responseType: 'blob',
        }).subscribe(
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response], {type: mediaType});
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

    /**
     * Método responsável por acessa o serviço que gerá o relatório
     * @param idAnalise indentificador da análise que será utilizada como base do relatório
     * @returns
     */
    public gerarRelatorioContagem(idAnalise: number): Observable<string> {
        this.blockUiService.show();
        this.http.request('get', `${this.relatorioContagemUrl}/${idAnalise}`, {
            responseType: 'blob',
        }).pipe(catchError((error: any) => {
            if (error.status === 500) {
                this.blockUiService.hide();
                this.pageNotificationService.addErrorMessage(this.getLabel('Erro ao gerar relatório'));
                return Observable.throw(new Error(error.status));
            }
        })).subscribe(
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response], {type: mediaType});
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise_contagem.pdf';
                anchor.href = fileURL;
                document.body.appendChild(anchor);
                anchor.click();
                this.blockUiService.hide();
                return null;
            });
        return null;
    }

    public find(id: Number): Observable<Analise> {
        return this.http.get<Analise>(`${this.resourceUrl}/${id}`);
    }

    public findAnalise(id: Number): Observable<Analise> {
        return this.http.get<Analise>(`${this.analiseResourceUrl}/${id}`);
    }
    public findView(id: Number): Observable<Analise> {
        return this.http.get<Analise>(`${this.resourceUrl}/view/${id}`);
    }


    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get<ResponseWrapper>(url);
    }

    findAnalisesUsuario(idUsuario: number): Observable<Divergencia[]> {
        const url = `${this.resourceUrl}/user/${idUsuario}`;
        return this.http.get<Divergencia[]>(url);
    }

    public query(req?: any): Observable<any> {
        const options = createRequestOption(req);
        return this.http.get<any>(this.resourceUrl).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    public delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${id}`).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }
        ));
    }

    private convertResponse(res): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    public convertItemFromServer(json: any): Divergencia {
        return new Divergencia().copyFromJSON(json);
    }

    convertJsonToAnalise(res): Divergencia[] {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return result;
    }

    private convert(analise: Divergencia): Divergencia {
        return analise.toJSONState();
    }



    deletarCompartilhar(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/compartilhar/delete/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    atualizarCompartilhar(compartilhada) {
        const copy = compartilhada;
        return this.http.put(`${this.resourceUrl}/compartilhar/viewonly/${copy.id}`, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    updateSomaPf(analiseId: number): Observable<Response> {
        const url = `${this.resourceUrl}/update-pf/${analiseId}`;
        return this.http.get<Response>(url);
    }

    search(event: LazyLoadEvent, rows: number, orderInSort: boolean, setParams: String, query?: any) {
        let page = 0;
        if (event !== undefined && event.first > 0) {
            page = Math.floor(event.first / rows);
        }

        let order = event.sortOrder === 1 ? 'asc' : 'desc';
        let params: HttpParams = new HttpParams()
        .set('page', page.toString())
        .set('size', rows.toString());

        if (orderInSort) {
            if (event.sortField !== undefined) {
                params = params.set('sort', event.sortField + ',' + order);
            }
        } else {
            if (event.sortField !== undefined) {
                params = params
                .set('sort', event.sortField)
                .set('order', order);
            }
        }

        if ('string' === typeof query) {
            params = params.set('query', query);
        }

        if ('object' === typeof query) {
            Object.keys(query).forEach(key => params = params.set(key, query[key]));
        }
        return this.http.get(`${this.resourceUrl}?${params.toString()}${setParams}`, { observe: 'response' });
    }

    updateDivergenciaSomaPf(analiseId: number): Observable<Response> {
        const url = `${this.resourceUrl}/update-divergente-pf/${analiseId}`;
        return this.http.get<Response>(url);
    }

    getDivergenciaResumo(analiseId: Number): Observable<Resumo[]> {
        return this.http.get<Resumo[]>(`${this.resourceResumoUrl}/divergencia/${analiseId}`,).pipe(
        catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    public changeStatusDivergence(id: number, status: Status){
        const url = `${this.analiseResourceUrl}/change-status/${id}/${status.id}`
        return this.http.get<Analise>(url);
    }
}
