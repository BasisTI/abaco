import { Sistema } from './../sistema/sistema.model';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {ResponseWrapper} from '../shared';
import {Observable} from '../../../node_modules/rxjs';
import {BaselineSintetico} from './baseline-sintetico.model';
import {BaselineAnalitico} from './baseline-analitico.model';
import { HttpClient } from '@angular/common/http';
import { FuncaoDados } from '../funcao-dados';
import { BlockUiService } from '@nuvem/angular-base';
import { TipoEquipe } from '../tipo-equipe';
import { catchError } from 'rxjs/internal/operators/catchError';
import { PageNotificationService } from '@nuvem/primeng-components';


@Injectable()
export class BaselineService {

    resourceUrl = environment.apiUrl + '/';
    sinteticosUrl = this.resourceUrl + 'baseline-sinteticos/';
    analiticosFDUrl = this.resourceUrl + 'baseline-analiticos/fd/';
    analiticosFuncaoDadosUrl = this.resourceUrl + 'baseline-analiticos/funcao-dados/';
    analiticosFTUrl = this.resourceUrl + 'baseline-analiticos/ft/';
    relatoriosBaselineUrl = this.resourceUrl + '/downloadPdfBaselineBrowser/';


    constructor(private http: HttpClient, private blockUiService: BlockUiService, private pageNotificationService: PageNotificationService) {
    }

    allBaselineSintetico(sistema: Sistema): Observable<BaselineSintetico[]> {
        let url = `${this.sinteticosUrl}`;
        if (sistema && sistema.id) {
            url = url + '?idSistema=' + sistema.id.valueOf();
        }
        return this.http.get<BaselineSintetico[]>(url);
    }

    getSistemaSintetico(id: number): Observable<BaselineSintetico> {
        return this.http.get<BaselineSintetico>(`${this.sinteticosUrl}${id}`);
    }
    getSistemaSinteticoEquipe(id: number, idEquipe: number): Observable<BaselineSintetico> {
        return this.http.get<BaselineSintetico>(`${this.sinteticosUrl}${id}/equipe/${idEquipe}`);
    }

    baselineAnaliticoFD(id: number): Observable<ResponseWrapper> {
        return this.http.get<ResponseWrapper>(`${this.analiticosFDUrl}${id}`);
    }

    analiticosFuncaoDados(id: number): Observable<ResponseWrapper> {
        return this.http.get<ResponseWrapper>(`${this.analiticosFuncaoDadosUrl}${id}`);
    }

    // POR EQUIPE

    baselineAnaliticoFDEquipe(id: number, idEquipe: number): Observable<ResponseWrapper> {
        return this.http.get<ResponseWrapper>(`${this.analiticosFDUrl}${id}/equipe/${idEquipe}`);
    }

    baselineAnaliticoFTEquipe(id: number, idEquipe: number): Observable<ResponseWrapper> {
        return this.http.get<ResponseWrapper>(`${this.analiticosFTUrl}${id}/equipe/${idEquipe}`);
    }

    private convertResponseSintetico(res): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemSintetico(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItemFuncaoDados(json: any): FuncaoDados {
        return FuncaoDados.convertJsonToObject(json);
    }

    private convertItemSintetico(json: any): BaselineSintetico {
        return BaselineSintetico.convertJsonToObject(json);
    }

    private convertJsonToSintetico(json: any): BaselineSintetico {
        const entity: BaselineSintetico = BaselineSintetico.convertJsonToObject(json);
        return entity;
    }

    private convertResponseFuncaoDados(res): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFuncaoDados(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertResponseAnalitico(res): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemAnalitico(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItemAnalitico(json: any): BaselineAnalitico {
        return BaselineAnalitico.convertJsonToObject(json);
    }

    /**
   *
   */
  public geraBaselinePdfBrowser(id: number): Observable<string> {
    this.blockUiService.show();
    this.http.request('get', `${this.relatoriosBaselineUrl}${id}`, {
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
    updateBaselineSintetico(sistema: Sistema, equipe: TipoEquipe): Observable<BaselineSintetico> {
        this.blockUiService.show();
        let url = `${this.sinteticosUrl}`;
        if (sistema && sistema.id) {
            url = url + 'update/' + sistema.id.valueOf() + '/' + equipe.id.valueOf();
        }
        return this.http.get<BaselineSintetico>(url);
    }

    public exportarModeloExcel(id: number, modelo: number) {
        this.blockUiService.show();
        return this.http.request('get', this.resourceUrl + "exportar-excel/" + id + "/" + modelo, {
            observe: "response",
            responseType: "blob"
        })
            .pipe(catchError((error: any) => {
                if (error.status === 500) {
                    this.blockUiService.hide();
                    this.pageNotificationService.addErrorMessage("Erro ao gerar o relatório");
                    return Observable.throw(new Error(error.status));
                }
            }))
    }
}
