import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Analise, AnaliseShareEquipe } from './';
import { TipoEquipe } from '../tipo-equipe';
import { Resumo } from './analise-resumo/resumo.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable, forkJoin, pipe } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpGenericErrorService, BlockUiService } from '@nuvem/angular-base';
import { ResponseWrapper, createRequestOption } from '../shared';
import { FuncaoDadosService } from '../funcao-dados/funcao-dados.service';
import { FuncaoTransacaoService } from '../funcao-transacao/funcao-transacao.service';
import { FuncaoTransacao } from '../funcao-transacao';
import { FuncaoDados } from '../funcao-dados';
import { Status } from '../status/status.model';
import { AbacoButtonsModule } from '../components/abaco-buttons/abaco-buttons.module';
import { TableBody } from 'primeng';

@Injectable()
export class AnaliseService {

    resourceUrl = environment.apiUrl + '/analises';

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

    changeStatusUrl = this.resourceUrl + '/change-status/';

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

    public create(analise: Analise): Observable<Analise> {
        const copy = this.convert(analise);
        return this.http.post<Analise>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    public atualizaAnalise(analise: Analise) {
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

    public update(analise: Analise): Observable<Analise> {
        const copy = this.convert(analise);
        return this.http.put<Analise>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    public block(analise: Analise): Observable<Analise> {
        const copy = analise;
        return this.http.put<Analise>(`${this.resourceUrl}/${copy.id}/block`, copy).pipe(catchError((error: any) => {
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
        this.http.request('get', `${this.relatoriosUrl}/${id}`, {
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




    /**
     *
     */
    public geraRelatorioPdfDetalhadoBrowser(id: Number): Observable<string> {
        this.blockUiService.show();
        this.http.request('get', `${this.relatoriosDetalhadoUrl}/${id}`, {
            observe: "response",
            responseType: 'blob',
        }).pipe(catchError((error: any) => {
            if (error.status === 500) {
                this.blockUiService.hide();
                this.pageNotificationService.addErrorMessage(this.getLabel('Erro ao gerar relatório'));
                return Observable.throw(new Error(error.status));
            }
        })).subscribe(
            (response) => {
                let filename = response.headers.get("content-disposition").split("filename=");
                const mediaType = 'application/pdf';
                const blob = new Blob([response.body], { type: mediaType });
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = filename[1];
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
        this.http.request('get', `${this.relatorioExcelUrl}/${id}`, {
            observe: "response",
            responseType: 'blob',
        }).pipe(catchError((error: any) => {
            if (error.status === 500) {
                this.blockUiService.hide();
                this.pageNotificationService.addErrorMessage(this.getLabel('Erro ao gerar relatório'));
                return Observable.throw(new Error(error.status));
            }
        })).subscribe(
            (response) => {
                let filename = response.headers.get("content-disposition").split("filename=");
                const mediaType = 'application/vnd.ms-excel';
                const blob = new Blob([response.body], { type: mediaType });
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = filename[1];
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

    /**
     * Método responsável por acessa o serviço que gerá o relatório
     * @param idAnalise indentificador da análise que será utilizada como base do relatório
     * @returns
     */
    public gerarRelatorioContagem(idAnalise: number): Observable<any> {
        this.blockUiService.show();
        this.http.request('get', `${this.relatorioContagemUrl}/${idAnalise}`, {
            observe: "response",
            responseType: 'blob',
        }).pipe(catchError((error: any) => {
            if (error.status === 500) {
                this.blockUiService.hide();
                this.pageNotificationService.addErrorMessage(this.getLabel('Erro ao gerar relatório'));
                return Observable.throw(new Error(error.status));
            }
        })).subscribe(
            (response) => {
                let filename = response.headers.get("content-disposition").split("filename=");
                const mediaType = 'application/pdf';
                const blob = new Blob([response.body], { type: mediaType });
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = filename[1];
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

    public findView(id: Number): Observable<Analise> {
        return this.http.get<Analise>(`${this.resourceUrl}/view/${id}`);
    }

    public findWithFuncaos(id: number): any {
        const analise: Analise = new Analise();
        analise.id = id;
        return forkJoin(this.http.get(`${this.resourceUrl}/${id}`),
            this.funcaoDadosService.getFuncaoDadosByAnalise(analise),
            this.funcaoTransacaoService.getFuncaoTransacaoByAnalise(analise));
    }

    public findWithFuncoesNormal(id: number): any {
        return forkJoin(this.http.get(`${this.resourceUrl}/${id}`),
            this.funcaoDadosService.getFuncaoDadosAnalise(id),
            this.funcaoTransacaoService.getFuncaoTransacaoAnalise(id));
    }

    public findAnaliseByJson(id: number): Observable<Analise>{
        return this.http.get<Analise>(this.resourceUrl+"/analise-json/"+id);
    }

    public clonarAnalise(id: number): Observable<Analise> {
        const url = this.clonarAnaliseUrl + id;
        return this.http.get<Analise>(url);
    }
    public clonarAnaliseToEquipe(id: number, equipe: TipoEquipe) {
        const url = this.clonarAnaliseUrl + id + '/' + equipe.id;
        return this.http.get<Analise>(url).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Erro ao clonar para equipe está análise.!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }
    public changeStatusAnalise(id: number, status: Status) {
        const url = this.changeStatusUrl + id + '/' + status.id;
        return this.http.get<Analise>(url);
    }

    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get<ResponseWrapper>(url);
    }

    findAnalisesUsuario(idUsuario: number): Observable<Analise[]> {
        const url = `${this.resourceUrl}/user/${idUsuario}`;
        return this.http.get<Analise[]>(url);
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

    public convertItemFromServer(json: any): Analise {
        return new Analise().copyFromJSON(json);
    }

    convertJsonToAnalise(res): Analise[] {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return result;
    }

    private convert(analise: Analise): Analise {
        return analise.toJSONState();
    }
    findAllCompartilhadaByAnalise(analiseId: number): Observable<AnaliseShareEquipe[]> {
        const url = `${this.findCompartilhadaByAnaliseUrl}/${analiseId}`;
        return this.http.get<AnaliseShareEquipe[]>(url);
    }

    findAllBaseline(): Observable<Response> {
        const url = `${this.resourceUrl}/baseline`;
        return this.http.get<Response>(url);
    }

    salvarCompartilhar(listaCompartilhada: Array<AnaliseShareEquipe>) {
        return this.http.post(`${this.resourceUrl}/compartilhar`, listaCompartilhada);
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

    getResumo(analiseId: Number): Observable<Resumo[]> {
        return this.http.get<Resumo[]>(`${this.resourceResumoUrl}/${analiseId}`,).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
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

    public generateDivergence(mainAnalise: Analise, secondaryAnalise: Analise, isUnionFunction: boolean): Observable<Analise> {
        if (!mainAnalise.id || !secondaryAnalise.id) {
            this.pageNotificationService.addErrorMessage('Erro nas Análises selecionadas!');
            return;
        }
        return this.http.get<Analise>(`${this.resourceUrl}/gerar-divergencia/${mainAnalise.id}/${secondaryAnalise.id}?isUnion=${isUnionFunction}`);
    }

    public updateDivergence(analise: Analise) {
        return this.http.get<Analise>(`${this.resourceUrl}/divergente/update/${analise.id}/`);
    }

    public generateDivergenceFromAnalise(analiseId): Observable<Analise> {
        return this.http.get<Analise>(`${this.resourceUrl}/divergencia/${analiseId}`).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    public importarJson(analise: Analise): Observable<Analise> {
        return this.http.post<Analise>(this.resourceUrl+"/importar-json", analise).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    public exportarModeloExcel(id: number, modelo: number) {
        this.blockUiService.show();
        return this.http.request('get', this.resourceUrl + "/importar-excel/" + id + "/" + modelo, {
            observe: "response",
            responseType: "blob"
        })
            .pipe(catchError((error: any) => {
                if (error.status === 500) {
                    this.blockUiService.hide();
                    this.pageNotificationService.addErrorMessage(this.getLabel('Erro ao gerar relatório'));
                    return Observable.throw(new Error(error.status));
                }
            }))
    }

    carregarAnaliseJson(analise: Analise) : Observable<Analise> {
        return this.http.post<Analise>(this.resourceUrl+"/carregarAnalise", analise);
    }


}
