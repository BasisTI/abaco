import { Sistema } from './../sistema/sistema.model';
import {Injectable} from '@angular/core';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {ResponseWrapper} from '../shared';
import {Response, RequestMethod, ResponseContentType, } from '@angular/http';
import {Observable} from '../../../node_modules/rxjs';
import {BaselineSintetico} from './baseline-sintetico.model';
import {BaselineAnalitico} from './baseline-analitico.model';
import {FuncaoDados} from '../funcao-dados';


@Injectable()
export class BaselineService {

    resourceUrl = environment.apiUrl + '/';
    sinteticosUrl = this.resourceUrl + 'baseline-sinteticos/';
    analiticosFDUrl = this.resourceUrl + 'baseline-analiticos/fd/';
    analiticosFuncaoDadosUrl = this.resourceUrl + 'baseline-analiticos/funcao-dados/';
    analiticosFTUrl = this.resourceUrl + 'baseline-analiticos/ft/';
    relatoriosBaselineUrl = this.resourceUrl + '/downloadPdfBaselineBrowser/';


    constructor(private http: HttpService) {
    }

    allBaselineSintetico(sistema : Sistema): Observable<ResponseWrapper> {
        let url = `${this.sinteticosUrl}?idSistema=`;
        if(sistema && sistema.id){
            url = url+ sistema.id.valueOf()    ;
        }
        return this.http.get(url).map((res: Response) => {
            return this.convertResponseSintetico(res);
        });
    }

    getSistemaSintetico(id: number): Observable<BaselineSintetico> {
        return this.http.get(`${this.sinteticosUrl}${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertJsonToSintetico(jsonResponse);
        });
    }
    getSistemaSinteticoEquipe(id: number, idEquipe: number): Observable<BaselineSintetico> {
        return this.http.get(`${this.sinteticosUrl}${id}/equipe/${idEquipe}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertJsonToSintetico(jsonResponse);
        });
    }

    baselineAnaliticoFD(id: number): Observable<ResponseWrapper> {
        return this.http.get(`${this.analiticosFDUrl}${id}`).map((res: Response) => {
            return this.convertResponseAnalitico(res);
        });
    }

    analiticosFuncaoDados(id: number): Observable<ResponseWrapper> {
        return this.http.get(`${this.analiticosFuncaoDadosUrl}${id}`).map((res: Response) => {
            return this.convertResponseFuncaoDados(res);
        });
    }

    // POR EQUIPE

    baselineAnaliticoFDEquipe(id: number, idEquipe: number): Observable<ResponseWrapper> {
        return this.http.get(`${this.analiticosFDUrl}${id}/equipe/${idEquipe}`).map((res: Response) => {
            return this.convertResponseAnalitico(res);
        });
    }

    baselineAnaliticoFTEquipe(id: number, idEquipe: number): Observable<ResponseWrapper> {
        return this.http.get(`${this.analiticosFTUrl}${id}/equipe/${idEquipe}`).map((res: Response) => {
            return this.convertResponseAnalitico(res);
        });
    }

    private convertResponseSintetico(res: Response): ResponseWrapper {
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

    private convertResponseFuncaoDados(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFuncaoDados(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertResponseAnalitico(res: Response): ResponseWrapper {
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
    this.http.get(`${this.relatoriosBaselineUrl}${id}`, {
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
        return null;
      });
      return null;
  }

}
