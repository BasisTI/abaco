import { FuncaoTransacao } from './../funcao-transacao/funcao-transacao.model';

import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable, Subject} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';


@Injectable()
export class FuncaoTransacaoService {

    funcaoTransacaoResourceUrl = environment.apiUrl + '/funcao-transacaos';

    allFuncaoTransacaosUrl = this.funcaoTransacaoResourceUrl + '/completa';

    public display = new Subject<boolean>();
    display$ = this.display.asObservable();

    constructor(private http: HttpService) {}

    getFuncaoTransacaosCompleta(analiseId: number): Observable<FuncaoTransacao> {
        return this.http.get(`${this.allFuncaoTransacaosUrl}/${analiseId}`).map((res: Response) => {
            const resposta = this.convertJsonToSinteticoTransacao(res.json());
            return resposta;
        });
    }

    private convertJsonToSinteticoTransacao(json: any): FuncaoTransacao {
        const entity: FuncaoTransacao = FuncaoTransacao.convertTransacaoJsonToObject(json);
        return entity;
    }

}
