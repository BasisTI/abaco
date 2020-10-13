import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

import { Divergencia } from '.';
import {TipoEquipe} from '../tipo-equipe';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable, forkJoin, pipe } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpGenericErrorService, BlockUiService } from '@nuvem/angular-base';
import { ResponseWrapper, createRequestOption } from '../shared';
import { FuncaoDadosService } from '../funcao-dados/funcao-dados.service';
import { FuncaoTransacaoService } from '../funcao-transacao/funcao-transacao.service';
import { FuncaoTransacao } from '../funcao-transacao';
import { FuncaoDados } from '../funcao-dados';
import { LazyLoadEvent } from 'primeng';

@Injectable()
export class DivergenciaService {

    resourceUrl = environment.apiUrl + '/divergencia';

    relatoriosUrl = environment.apiUrl + '/relatorioPdfBrowser';

    findByOrganizacaoUrl = this.resourceUrl + '/organizacao';

    findCompartilhadaByAnaliseUrl = environment.apiUrl + '/compartilhada';

    relatorioAnaliseUrl = environment.apiUrl + '/relatorioPdfArquivo';

    relatoriosDetalhadoUrl = environment.apiUrl + '/downloadPdfDetalhadoBrowser';

    relatorioExcelUrl = environment.apiUrl + '/downloadRelatorioExcel';

    searchUrl = environment.apiUrl + '/_search/analises';

    relatoriosBaselineUrl = environment.apiUrl + '/downloadPdfBaselineBrowser';

    relatorioContagemUrl = environment.apiUrl + '/relatorioContagemPdf';

    clonarAnaliseUrl = this.resourceUrl + '/clonar/';

    resourceResumoUrl = environment.apiUrl + '/vw-resumo';


    constructor(
        private http: HttpClient,
        private pageNotificationService: PageNotificationService,
        private genericService: HttpGenericErrorService,
        private funcaoDadosService: FuncaoDadosService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private blockUiService: BlockUiService,
        ) {
    }

    getLabel(label) {
        return label;
    }

    public create(analise: Divergencia): Observable<Divergencia> {
        const copy = this.convert(analise);
        return this.http.post<Divergencia>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    public atualizaAnalise(analise: Divergencia) {
        this.update(analise)
            .subscribe(() => (function () {
                this.funcaoTransacaoService.getFuncaoTransacaoByAnalise(this.analise.id)
                    .subscribe(response => (
                        response.forEach(value => (
                            this.analise.funcaoTransacaos.push(FuncaoTransacao.convertTransacaoJsonToObject(value)))
                        )
                    )).then(
                    this.funcaoDadosService.getFuncaoDadosByAnalise(this.analise.id)
                        .subscribe(response => (
                            response.forEach(value => (
                                this.analise.funcaoDados.push(FuncaoDados.convertJsonToObject(value)))
                            )
                        ))
                );
            }));
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

    public block(analise: Divergencia): Observable<Divergencia> {
        const copy = analise;
        return this.http.put<Divergencia>(`${this.resourceUrl}/${copy.id}/block`, copy).pipe(catchError((error: any) => {
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

    public find(id: Number): Observable<Divergencia> {
        return this.http.get<Divergencia>(`${this.resourceUrl}/${id}`);
    }

    public findView(id: Number): Observable<Divergencia> {
        return this.http.get<Divergencia>(`${this.resourceUrl}/view/${id}`);
    }

    public clonarAnalise(id: number): Observable<Divergencia> {
        const url = this.clonarAnaliseUrl + id;
        return this.http.get<Divergencia>(url);
    }
    public clonarAnaliseToEquipe(id: number, equipe: TipoEquipe) {
        const url = this.clonarAnaliseUrl + id + '/' + equipe.id;
        return this.http.get<Divergencia>(url);
    }

    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get<ResponseWrapper>(url);
    }

    findAnalisesUsuario(idUsuario: number): Observable<Divergencia[]> {
        const url = `${this.resourceUrl}/user/${idUsuario}`;
        return this.http.get<Divergencia[]>(url);
    }

    tratarErro(erro: string, id: number) {
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


}
