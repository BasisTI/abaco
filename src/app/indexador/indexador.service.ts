import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';

@Injectable()
export class IndexadorService {

    resourceUrl = environment.apiUrl + '/indexador/index';
    urlIndexarObject = environment.apiUrl + '/reindexar';
    urlListIndex = environment.apiUrl + '/listar-indexadores';

    @BlockUI() blockUI: NgBlockUI;

    constructor(private http: HttpService) {
    }

    reindexar(lstIndexadores: string[]): Observable<any> {
        this.blockUI.start();
        const url = this.urlIndexarObject + '?lstIndexadores=' + lstIndexadores.toString();
        return this.http.get(url).map(
            (res: Response) => {
                this.blockUI.stop();
                return res.json();
            });
    }

}
