import {Injectable} from '@angular/core';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {ResponseWrapper} from '../shared';
import {Response} from '@angular/http';
import {Observable} from '../../../node_modules/rxjs';
import {BaselineSintetico} from './baseline-sintetico.model';
import {BaselineAnalitico} from './baseline-analitico.model';
import {Sistema} from '../sistema/sistema.model';


@Injectable()
export class BaselineService {

    resourceUrl = environment.apiUrl + '/';
    sinteticosUrl = this.resourceUrl + 'baseline-sinteticos/';
    analiticosFDUrl = this.resourceUrl + 'baseline-analiticos/fd/';
    analiticosFuncaoDadosUrl = this.resourceUrl + 'baseline-analiticos/funcao-dados/';
    analiticosFTUrl = this.resourceUrl + 'baseline-analiticos/ft/';


    constructor(private http: HttpService) {
    }

    allBaselineSintetico(): Observable<ResponseWrapper> {
        return this.http.get(`${this.sinteticosUrl}`).map((res: Response) => {
            return this.convertResponseSintetico(res);
        });
    }

    getSistemaSintetico(id: number): Observable<BaselineSintetico> {
        return this.http.get(`${this.sinteticosUrl}${id}`).map((res: Response) => {
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
            return this.convertResponseAnalitico(res);
        });
    }

    baselineAnaliticoFT(id: number): Observable<ResponseWrapper> {
        return this.http.get(`${this.analiticosFTUrl}${id}`).map((res: Response) => {
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

    private convertItemSintetico(json: any): BaselineSintetico {
        return BaselineSintetico.convertJsonToObject(json);
    }

    private convertJsonToSintetico(json: any): BaselineSintetico {
        const entity: BaselineSintetico = BaselineSintetico.convertJsonToObject(json);
        return entity;
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

}
