import {Injectable} from '@angular/core';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {createRequestOption, ResponseWrapper} from '../shared';
import {Response} from '@angular/http';
import {Observable} from '../../../node_modules/rxjs';
import {FatorAjuste} from '../fator-ajuste/fator-ajuste.model';
import {BaselineSintetico} from './baseline-sintetico.model';
import {Sistema} from '../sistema/sistema.model';


@Injectable()
export class BaselineService {

    resourceUrl = environment.apiUrl + '/';
    sinteticosUrl = this.resourceUrl + 'baseline-sinteticos/';
    analiticosUrl = this.resourceUrl + 'baseline-analiticos/';


    constructor(private http: HttpService) {
    }

    allBaselineSintetico(): Observable<ResponseWrapper> {
        return this.http.get(`${this.sinteticosUrl}`).map((res: Response) => {
            console.log('res ', res);
            return this.convertResponse(res);
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

    private convertItemFromServer(json: any): BaselineSintetico {
        return BaselineSintetico.convertJsonToObject(json);
    }


}
