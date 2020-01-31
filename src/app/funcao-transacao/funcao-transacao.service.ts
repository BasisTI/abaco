import { FuncaoTransacao } from './../funcao-transacao/funcao-transacao.model';

import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable, Subject} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {FuncaoDados} from '../funcao-dados';
import {BlockUI, NgBlockUI} from 'ng-block-ui';


@Injectable()
export class FuncaoTransacaoService {

    @BlockUI() blockUI: NgBlockUI;

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

    public getFuncaoTransacaoByAnalise(id: number): Observable<FuncaoDados[]> {
        this.blockUI.start();
        const url = `${this.funcaoTransacaoResourceUrl}-dto/analise/${id}`;
        return this.http.get(url).map((res: Response) => {
            return res.json();
        }).finally(() => (this.blockUI.stop()));
    }


}
