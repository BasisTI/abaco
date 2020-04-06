import {FuncaoTransacao} from './../funcao-transacao/funcao-transacao.model';

import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable, Subject} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Analise} from '../analise';
import {PageNotificationService} from '../shared';


@Injectable()
export class FuncaoTransacaoService {

    @BlockUI() blockUI: NgBlockUI;

    funcaoTransacaoResourceUrl = environment.apiUrl + '/funcao-transacaos';

    allFuncaoTransacaosUrl = this.funcaoTransacaoResourceUrl + '/completa';

    public display = new Subject<boolean>();
    display$ = this.display.asObservable();

    constructor(private http: HttpService, private pageNotificationService: PageNotificationService) {
    }

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

    public getFuncaoTransacaoByAnalise(analise: Analise): Observable<FuncaoTransacao[]> {
        const url = `${this.funcaoTransacaoResourceUrl}-dto/analise/${analise.id}`;
        return this.http.get(url).map((res: Response) => {
            return res.json();
        });
    }

    public getFuncaoTransacaoByIdAnalise(id: Number): Observable<any[]> {
        this.blockUI.start();
        const url = `${this.funcaoTransacaoResourceUrl}-dto/analise/${id}`;
        return this.http.get(url).map((res) => {
            return res.json();
        }).finally(() => this.blockUI.stop());
    }

    private convertItemFromServer(json: any): FuncaoTransacao {
        return new FuncaoTransacao().copyFromJSON(json);
    }

    convertJsonToFucaoTransacao(res): FuncaoTransacao[] {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return result;
    }

    create(funcaoTransacao: FuncaoTransacao, idAnalise: Number): Observable<any> {
        this.blockUI.start();
        const json = funcaoTransacao.toJSONState();
        return this.http.post(`${this.funcaoTransacaoResourceUrl}/${idAnalise}`, json).map((res: Response) => {
            return res.json();
        });
    }

    update(funcaoTransacao: FuncaoTransacao) {
        this.blockUI.start();
        const copy = funcaoTransacao.toJSONState();
        return this.http.put(`${this.funcaoTransacaoResourceUrl}/${copy.id}`, copy).map((res: Response) => {
            return null;
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg();
                this.blockUI.stop();
                return Observable.throw(new Error(error.status));
            }
        });
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.funcaoTransacaoResourceUrl}/${id}`);
    }

    existsWithName(name: String, idAnalise: number, idFuncionalade: number, idModulo: number, id: Number = 0): Observable<Boolean> {
        this.blockUI.start();
        const url = `${this.funcaoTransacaoResourceUrl}/${idAnalise}/${idFuncionalade}/${idModulo}?name=${name}&id=${id}`;
        return this.http.get(url)
            .map(res => res.json()).finally(() => {
                this.blockUI.stop();
            });
    }

    public getById(id: Number): Observable<FuncaoTransacao> {
        const url = `${this.funcaoTransacaoResourceUrl}/${id}`;
        this.blockUI.start();
        return this.http.get(url).map((res) => {
            return this.convertItemFromServer(res.json());
        });
    }


}
