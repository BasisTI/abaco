import {Manual} from './../manual/manual.model';
import {FuncaoTransacao} from './../funcao-transacao/funcao-transacao.model';
import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable, Subject} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {PageNotificationService, ResponseWrapper} from '../shared';
import {FuncaoDados} from '.';
import {Funcionalidade} from '../funcionalidade';
import {BlockUI, NgBlockUI} from 'ng-block-ui';
import {Analise} from '../analise';

@Injectable()
export class FuncaoDadosService {

    resourceUrl = environment.apiUrl + '/funcao-dados';
    resourceUrlPEAnalitico = environment.apiUrl + '/peanalitico/fd';
    funcaoTransacaoResourceUrl = environment.apiUrl + '/funcao-transacaos';
    manualResourceUrl = environment.apiUrl + '/manuals';
    @BlockUI() blockUI: NgBlockUI;

    /*
    Subject criado para Buscar funcionalidade da Baseline.
    Preencher o Dropdown do componente 'modulo-funcionalidade.component' com modulo e submodulo.
    */
    public mod = new Subject<Funcionalidade>();
    dataModd$ = this.mod.asObservable();

    constructor(private http: HttpService,
                private pageNotificationService: PageNotificationService) {
    }

    gerarCrud(funcaoTransacao: FuncaoTransacao) {
    }

    findAllNamesBySistemaId(sistemaId: number): Observable<string[]> {
        this.blockUI.start();
        const url = `${this.resourceUrl}/${sistemaId}/funcao-dados`;
        return this.http.get(url)
            .map((res: Response) => res.json().map(json => json.nome));
    }

    dropDown(): Observable<any> {
        return this.http.get(this.resourceUrl + '/drop-down')
            .map((res: Response) => res.json());
    }

    dropDownPEAnalitico(idSistema): Observable<any> {
        this.blockUI.start();
        return this.http.get(this.resourceUrlPEAnalitico + '/drop-down/' + idSistema)
            .map((res: Response) => res.json());
    }

    autoCompletePEAnalitico(name: String, idFuncionalidade: number): Observable<any> {
        const url = `${this.resourceUrlPEAnalitico}?name=${name}&idFuncionalidade=${idFuncionalidade}`;
        return this.http.get(url)
            .map((res: Response) => res.json());
    }

    recuperarFuncaoDadosPorIdNome(id: number, nome: string): Observable<FuncaoDados> {
        const url = `${this.resourceUrl}/${id}/funcao-dados-versionavel/${nome}`;
        return this.http.get(url)
            .map((res: Response) => res.json());
    }

    public getById(id: Number): Observable<FuncaoDados> {
        const url = `${this.resourceUrl}/${id}`;
        this.blockUI.start();
        return this.http.get(url).map((res) => {
            return this.convertItemFromServer(res.json());
        });
    }

    public getFuncaoDadosAnalise(id: number): Observable<ResponseWrapper> {
        const url = `${this.resourceUrl}/analise/${id}`;
        return this.http.get(url).map((res: Response) => {
            return this.convertResponseFuncaoDados(res);
        });
    }

    public getFuncaoDadosByAnalise(analise: Analise): Observable<FuncaoDados[]> {
        const url = `${this.resourceUrl}-dto/analise/${analise.id}`;
        return this.http.get(url).map((res) => {
            return this.convertJsonToFucaoDados(res);
        });
    }

    public getFuncaoDadosByIdAnalise(id: Number): Observable<any[]> {
        this.blockUI.start();
        const url = `${this.resourceUrl}-dto/analise/${id}`;
        return this.http.get(url).map((res) => {
            return res.json();
        }).finally(() => this.blockUI.stop());
    }

    getFuncaoDadosBaseline(id: number): Observable<FuncaoDados> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return this.convertItemFromServer(res.json());
        });
    }

    getFuncaoTransacaoBaseline(id: number): Observable<FuncaoTransacao> {
        return this.http.get(`${this.funcaoTransacaoResourceUrl}/${id}`).map((res: Response) => {
            const resposta = this.convertJsonToSinteticoTransacao(res.json());
            return resposta;
        });
    }

    getManualDeAnalise(id: number): Observable<Manual> {
        return this.http.get(`${this.manualResourceUrl}/${id}`).map((res: Response) => {
            const resposta = this.convertJsonManual(res.json());
            return resposta;
        });
    }

    private convertJsonToSintetico(json: any): FuncaoDados {
        const entity: FuncaoDados = FuncaoDados.convertJsonToObject(json);
        return entity;
    }

    private convertJsonToSinteticoTransacao(json: any): FuncaoTransacao {
        const entity: FuncaoTransacao = FuncaoTransacao.convertTransacaoJsonToObject(json);
        return entity;
    }

    private convertJsonManual(json: any): Manual {
        const entity: Manual = Manual.convertManualJsonToObject(json);
        return entity;
    }

    public delete(id: number): Observable<Response> {
        this.blockUI.start();
        return this.http.delete(`${this.resourceUrl}/${id}`).finally(() => {
            this.blockUI.stop();
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

    private convertItem(json: any): FuncaoDados {
        return FuncaoDados.convertJsonToObject(json);
    }

    private convertResponseFuncaoDados(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItem(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItemFromServer(json: any): FuncaoDados {
        return new FuncaoDados().copyFromJSON(json);
    }

    convertJsonToFucaoDados(res): FuncaoDados[] {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return result;
    }

    create(funcaoDados: FuncaoDados, idAnalise: Number): Observable<any> {
        this.blockUI.start();
        const json = funcaoDados.toJSONState();
        return this.http.post(`${this.resourceUrl}/${idAnalise}`, json).map((res: Response) => {
            return res.json();
        });
    }

    update(funcaoDados: FuncaoDados) {
        this.blockUI.start();
        const copy = funcaoDados.toJSONState();
        return this.http.put(`${this.resourceUrl}/${copy.id}`, copy).map((res: Response) => {
            return null;
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg();
                return Observable.throw(new Error(error.status));
            }
        }).finally(() => {
            this.blockUI.stop();
        });
    }

    existsWithName(name: String, idAnalise: number, idFuncionalade: number, idModulo: number, id: number = 0): Observable<Boolean> {
        const url = `${this.resourceUrl}/${idAnalise}/${idFuncionalade}/${idModulo}?name=${name}&id=${id}`;
        return this.http.get(url)
            .map(res => res.json());
    }
}
