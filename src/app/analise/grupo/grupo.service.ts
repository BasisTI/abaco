import {Injectable} from '@angular/core';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../../environments/environment';
import {ResponseWrapper} from '../../shared';
import {Response,} from '@angular/http';
import {Observable} from '../../../../node_modules/rxjs';
import {Grupo} from './grupo.model';


@Injectable()
export class GrupoService {

    resourceUrl = environment.apiUrl + '/';
    grupoUrl = this.resourceUrl + 'analises/grupos';

    constructor(private http: HttpService) {
    }

    all(): Observable<ResponseWrapper> {
        return this.http.get(`${this.grupoUrl}`).map((res: Response) => {
            console.log(res);
            return this.convertResponse(res);
        });
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItem(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItem(json: any): Grupo {
        return Grupo.convertJsonToObject(json);
    }


}
