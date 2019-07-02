import { Manual } from './../manual/manual.model';
import { FuncaoTransacao } from './../funcao-transacao/funcao-transacao.model';
import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable, Subject} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {ResponseWrapper, createRequestOption, JhiDateUtils} from '../shared';
import {FuncaoDados} from '.';
import {Analise} from '../analise/analise.model';
import {tap} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';
import {BaselineSintetico} from '../baseline/baseline-sintetico.model';
import { Funcionalidade } from '../funcionalidade';

@Injectable()
export class FuncaoDadosService {

    resourceUrl = environment.apiUrl + '/funcao-dados';

    funcaoTransacaoResourceUrl = environment.apiUrl + '/funcao-transacaos';

    manualResourceUrl = environment.apiUrl + '/manuals';
    
    /*
    Subject criado para Buscar funcionalidade da Baseline.
    Preencher o Dropdown do componente 'modulo-funcionalidade.component' com modulo e submodulo.
    */
    public mod = new Subject<Funcionalidade>();
    dataModd$ = this.mod.asObservable();

    constructor(private http: HttpService) {
    }

    gerarCrud(funcaoTransacao: FuncaoTransacao) {
    }

    findAllNamesBySistemaId(sistemaId: number): Observable<string[]> {
        const url = `${this.resourceUrl}/${sistemaId}/funcao-dados`;
        return this.http.get(url)
            .map((res: Response) => res.json().map(json => json.nome));
    }

    dropDown(): Observable<any> {
        return this.http.get(this.resourceUrl + '/drop-down')
            .map((res: Response) => res.json());
    }

    recuperarFuncaoDadosPorIdNome(id: number, nome: string): Observable<FuncaoDados> {
        const url = `${this.resourceUrl}/${id}/funcao-dados-versionavel/${nome}`;
        return this.http.get(url)
            .map((res: Response) => res.json());
    }

    public getFuncaoDadosAnalise(id: number): Observable<ResponseWrapper> {
        const url = `${this.resourceUrl}/analise/${id}`;
        return this.http.get(url).map((res: Response) => {
            return this.convertResponseFuncaoDados(res);
        });
    }

    getFuncaoDadosBaseline(id: number): Observable<FuncaoDados> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const resposta = this.convertJsonToSintetico(res.json());
            return resposta;
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
        return this.http.delete(`${this.resourceUrl}/${id}`);
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


}
