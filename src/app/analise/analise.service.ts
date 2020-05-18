import { element } from 'protractor';
import {TranslateService} from '@ngx-translate/core';
import {Injectable} from '@angular/core';
import {RequestMethod, Response, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {Analise, AnaliseShareEquipe} from './';
import {createRequestOption, PageNotificationService, ResponseWrapper} from '../shared';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {GenericService} from '../util/service/generic.service';
import {FuncaoTransacao} from '../funcao-transacao';
import {FuncaoDados} from '../funcao-dados';
import {FuncaoTransacaoService} from '../funcao-transacao/funcao-transacao.service';
import {FuncaoDadosService} from '../funcao-dados/funcao-dados.service';
import {TipoEquipe} from '../tipo-equipe';
import { Resumo } from './resumo/resumo.model';

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

    resourceResumoUrl = environment.apiUrl + '/vw-resumo';

    @BlockUI() blockUI: NgBlockUI;

    constructor(
        private http: HttpService,
        private pageNotificationService: PageNotificationService,
        private genericService: GenericService,
        private funcaoDadosService: FuncaoDadosService,
        private funcaoTransacaoService: FuncaoTransacaoService,
        private translate: TranslateService) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    public create(analise: Analise): Observable<Analise> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.CriandoAnálise'));
        const copy = this.convert(analise);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.blockUI.stop();
            return this.genericService.convertJsonToObject(res.json(), new Analise());
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
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
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.AtualizandoAnalise'));
        const copy = this.convert(analise);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        }).finally(() => (this.blockUI.stop()));
    }

    public block(analise: Analise): Observable<Analise> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.BloqueandoDesbloqueandoAnalise'));
        const copy = analise;
        return this.http.put(`${this.resourceUrl}/${copy.id}/block`, copy).map((res: Response) => {
            this.blockUI.stop();
            return null;
        }).catch((error: any) => {
            switch (error.status) {
                case 400: {
                    if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.notadmin') {
                        this.pageNotificationService.addErrorMsg(
                            this.getLabel('Analise.Analise.Mensagens.msgSomenteAdministradoresBloquearDesbloquear')
                        );
                    }
                    break;
                }
                case 403: {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    break;
                }
            }
            return Observable.throw(new Error(error.status));
        });
    }

    public gerarRelatorioPdfArquivo(id: number) {
        window.open(`${this.relatorioAnaliseUrl}/${id}`);
    }

    public geraRelatorioPdfBrowser(id: number): Observable<string> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
        this.http.get(`${this.relatoriosUrl}/${id}`, {
            method: RequestMethod.Get,
            responseType: ResponseContentType.Blob,
        }).subscribe(
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response.blob()], {type: mediaType});
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise.pdf';
                anchor.href = fileURL;
                window.open(fileURL, '_blank', '');
                this.blockUI.stop();
                return null;
            });
        return null;
    }

    /**
     *
     */
    public geraRelatorioPdfDetalhadoBrowser(id: Number): Observable<string> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
        this.http.get(`${this.relatoriosDetalhadoUrl}/${id}`, {
            method: RequestMethod.Get,
            responseType: ResponseContentType.Blob,
        }).catch((error: any) => {
            if (error.status === 500) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.ErroGerarRelatorio'));
                this.blockUI.stop();
                return Observable.throw(new Error(error.status));
            }
        }).subscribe(
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response.blob()], {type: mediaType});
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise.pdf';
                anchor.href = fileURL;
                document.body.appendChild(anchor);
                anchor.click();
                this.blockUI.stop();
                return null;
            });
        return null;
    }

    /**
     *
     */
    public gerarRelatorioExcel(id: Number): Observable<string> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
        this.http.get(`${this.relatorioExcelUrl}/${id}`, {
            method: RequestMethod.Get,
            responseType: ResponseContentType.Blob,
        }).catch((error: any) => {
            this.blockUI.stop();
            if (error.status === 500) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.ErroGerarRelatorio'));
                this.blockUI.stop();
                return Observable.throw(new Error(error.status));
            }
        }).subscribe(
            (response) => {
                const mediaType = 'application/vnd.ms-excel';
                const blob = new Blob([response.blob()], {type: mediaType});
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise.xls';
                anchor.href = fileURL;
                document.body.appendChild(anchor);
                anchor.click();
                this.blockUI.stop();
                return null;
            });
        return null;
    }

    /**
     *
     */
    public geraBaselinePdfBrowser(): Observable<string> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
        this.http.get(`${this.relatoriosBaselineUrl}`, {
            method: RequestMethod.Get,
            responseType: ResponseContentType.Blob,
        }).subscribe(
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response.blob()], {type: mediaType});
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise.pdf';
                anchor.href = fileURL;
                window.open(fileURL, '_blank', '');
                this.blockUI.stop();
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
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
        this.http.get(`${this.relatorioContagemUrl}/${idAnalise}`, {
            method: RequestMethod.Get,
            responseType: ResponseContentType.Blob,
        }).catch((error: any) => {
            this.blockUI.stop();
            if (error.status === 500) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.ErroGerarRelatorio'));
                this.blockUI.stop();
                return Observable.throw(new Error(error.status));
            }
        }).subscribe(
            (response) => {
                const mediaType = 'application/pdf';
                const blob = new Blob([response.blob()], {type: mediaType});
                const fileURL = window.URL.createObjectURL(blob);
                const anchor = document.createElement('a');
                anchor.download = 'analise_contagem.pdf';
                anchor.href = fileURL;
                document.body.appendChild(anchor);
                anchor.click();
                this.blockUI.stop();
                return null;
            });
        return null;
    }

    public find(id: Number): Observable<Analise> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.ProcurandoAnalise'));
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            const analiseJson = this.convertItemFromServer(jsonResponse);
            analiseJson.pfTotal = jsonResponse.pfTotal;
            analiseJson.adjustPFTotal = jsonResponse.adjustPFTotal;
            analiseJson.createdBy = jsonResponse.createdBy;
            this.blockUI.stop();
            return analiseJson;
        });
    }

    public findView(id: Number): Observable<Analise> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.ProcurandoAnalise'));
        return this.http.get(`${this.resourceUrl}/view/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            const analiseJson = this.convertItemFromServer(jsonResponse);
            analiseJson.pfTotal = jsonResponse.pfTotal;
            analiseJson.adjustPFTotal = jsonResponse.adjustPFTotal;
            analiseJson.createdBy = jsonResponse.createdBy;
            this.blockUI.stop();
            return analiseJson;
        });
    }

    public findWithFuncaos(id: number): Observable<Analise> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.ProcurandoAnalise'));
        let analise: Analise = new Analise();
        analise.id = id;
        return Observable.forkJoin(this.http.get(`${this.resourceUrl}/${id}`),
            this.funcaoDadosService.getFuncaoDadosByAnalise(analise),
            this.funcaoTransacaoService.getFuncaoTransacaoByAnalise(analise)).map(response => {
            const jsonResponse = response[0].json();
            jsonResponse['funcaoDados'] = response[1];
            jsonResponse['funcaoTransacaos'] = response[2];
            analise = this.convertItemFromServer(jsonResponse);
            analise.createdBy = jsonResponse.createdBy;
            return analise;
        }).finally(() => (this.blockUI.stop()));
    }

    public clonarAnalise(id: number): Observable<Analise> {
        this.blockUI.start();
        const url = this.clonarAnaliseUrl + id;
        return this.http.get(url).map(response => {
            const jsonResponse = response.json();
            let analise: Analise;
            analise = this.convertItemFromServer(jsonResponse);
            return analise;
        }).finally(() => {
            this.blockUI.stop();
        });
    }
    public clonarAnaliseToEquipe(id: number, equipe: TipoEquipe) {
        this.blockUI.start();
        const url = this.clonarAnaliseUrl + id + '/' + equipe.id;
        return this.http.get(url).map(response => {
            return response.json();
        }).finally(() => {
            this.blockUI.stop();
        });
    }

    findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get(url)
            .map((res: Response) => this.convertResponse(res));
    }

    findAnalisesUsuario(idUsuario: number): Observable<Analise[]> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.FiltrandoAnalises'));
        const url = `${this.resourceUrl}/user/${idUsuario}`;
        return this.http.get(url)
            .map(
                (res: Response) => this.convertJsonToAnalise(res),
                (error) => this.tratarErro(error.toString(), idUsuario)
            );
    }

    tratarErro(erro: string, id: number) {
    }

    public query(req?: any): Observable<ResponseWrapper> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.AguardeUmMomento'));
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    public delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
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
        this.blockUI.stop();
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItemFromServer(json: any): Analise {
        return new Analise().copyFromJSON(json);
    }

    convertJsonToAnalise(res: Response): Analise[] {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        this.blockUI.stop();
        return result;
    }

    private convert(analise: Analise): Analise {
        return analise.toJSONState();
    }

    findAllCompartilhadaByAnalise(analiseId: number): Observable<ResponseWrapper> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.BuscandoAnalises'));
        const url = `${this.findCompartilhadaByAnaliseUrl}/${analiseId}`;
        return this.http.get(url)
            .map((res: Response) => this.convertResponse(res));
    }

    findAllBaseline(): Observable<Response> {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.BuscandoAnalisesBaseline'));
        const url = `${this.resourceUrl}/baseline`;
        return this.http.get(url);
    }

    salvarCompartilhar(listaCompartilhada: Array<AnaliseShareEquipe>) {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.CompartilhandoAnalise'));
        return this.http.post(`${this.resourceUrl}/compartilhar`, listaCompartilhada).map((res: Response) => {
            const jsonResponse = res.json();
            this.blockUI.stop();
            return jsonResponse;
        });
    }

    deletarCompartilhar(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/compartilhar/delete/${id}`).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    atualizarCompartilhar(compartilhada) {
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.AtualizandoCompartilhamento'));
        const copy = compartilhada;
        return this.http.put(`${this.resourceUrl}/compartilhar/viewonly/${copy.id}`, copy).map((res: Response) => {
            this.blockUI.stop();
            return null;
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }

    updateSomaPf(analiseId:number): Observable<Response> {
        this.blockUI.start();
        const url = `${this.resourceUrl}/update-pf/${analiseId}`;
        return this.http.get(url);
    }

    getResumo(analiseId:Number): Observable<Resumo[]>{
        this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.ProcurandoAnalise'));
        return this.http.get(`${this.resourceResumoUrl}/${analiseId}`,).map((res: Response) => {
            const jsonResponse = res.json();
            let lstResumo: Resumo[] = [];
            jsonResponse.forEach(elem => {
              let rsm: Resumo = new Resumo( elem.pfAjustada, elem.pfTotal, elem.quantidadeTipo, elem.sem, elem.baixa, elem.media, elem.alta, elem.inm, elem.tipo).clone();
              lstResumo.push(rsm);
            });
            
            this.blockUI.stop();
            return lstResumo;
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
    }
}
