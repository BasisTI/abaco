import {FuncaoTransacao} from './../funcao-transacao/funcao-transacao.model';
import {Injectable} from '@angular/core';

import {FuncaoDados} from '.';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { catchError } from 'rxjs/operators';
import { Funcionalidade } from 'src/app/funcionalidade';
import { ResponseWrapper } from 'src/app/shared';
import { Manual } from 'src/app/manual';
import { Analise } from '../analise';
import { CommentFuncaoDados } from './comment-funcado-dados.model';
import { Status } from '../status/status.model';

@Injectable()
export class FuncaoDadosService {

    resourceUrl = environment.apiUrl + '/funcao-dados';
    resourceUrlComment = environment.apiUrl + '/comment/funcao-dados';
    vwresourceUrl = environment.apiUrl + '/vw-funcao-dados';
    resourceUrlPEAnalitico = environment.apiUrl + '/peanalitico/';
    funcaoTransacaoResourceUrl = environment.apiUrl + '/funcao-transacaos';
    manualResourceUrl = environment.apiUrl + '/manuals';
    /*
    Subject criado para Buscar funcionalidade da Baseline.
    Preencher o Dropdown do componente 'modulo-funcionalidade.component' com modulo e submodulo.
    */
    public mod = new Subject<Funcionalidade>();
    dataModd$ = this.mod.asObservable();

    constructor(private http: HttpClient,
                private pageNotificationService: PageNotificationService) {
    }

    gerarCrud(funcaoTransacao: FuncaoTransacao) {
    }

    findAllNamesBySistemaId(sistemaId: number): Observable<string[]> {
        const url = `${this.resourceUrl}/${sistemaId}/funcao-dados`;
        return this.http.get<string[]>(url);
    }

    dropDown(): Observable<any> {
        return this.http.get(this.resourceUrl + '/drop-down');
    }

    dropDownPEAnalitico(idSistema): Observable<any> {
        return this.http.get(this.resourceUrlPEAnalitico + 'drop-down/' + idSistema);
    }

    autoCompletePEAnalitico(name: String, idFuncionalidade: number): Observable<any> {
        const url = `${this.resourceUrlPEAnalitico}/fd?name=${name}&idFuncionalidade=${idFuncionalidade}`;
        return this.http.get(url);
    }

    recuperarFuncaoDadosPorIdNome(id: number, nome: string): Observable<FuncaoDados> {
        const url = `${this.resourceUrl}/${id}/funcao-dados-versionavel/${nome}`;
        return this.http.get<FuncaoDados>(url);
    }

    public getById(id: Number): Observable<FuncaoDados> {
        const url = `${this.resourceUrl}/${id}`;
        return this.http.get<FuncaoDados>(url);
    }

    public getFuncaoDadosAnalise(id: number): Observable<ResponseWrapper> {
        const url = `${this.resourceUrl}/analise/${id}`;
        return this.http.get<ResponseWrapper>(url);
    }

    public getFuncaoDadosByAnalise(analise: Analise): Observable<FuncaoDados[]> {
        const url = `${this.resourceUrl}-dto/analise/${analise.id}`;
        return this.http.get<FuncaoDados[]>(url);
    }

    public getFuncaoDadosByIdAnalise(id: Number): Observable<any[]> {
        const url = `${this.resourceUrl}-dto/analise/${id}`;
        return this.http.get<any[]>(url);
    }

    getFuncaoDadosBaseline(id: number): Observable<FuncaoDados> {
        return this.http.get<FuncaoDados>(`${this.resourceUrl}/${id}`);
    }

    getFuncaoTransacaoBaseline(id: number): Observable<FuncaoTransacao> {
        return this.http.get<FuncaoTransacao>(`${this.funcaoTransacaoResourceUrl}/${id}`);
    }

    getManualDeAnalise(id: number): Observable<Manual> {
        return this.http.get<Manual>(`${this.manualResourceUrl}/${id}`);
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

    delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${id}`);
    }

    deleteStatus(id: number): Observable<Response> {
        return this.http.get<Response>(`${this.resourceUrl}/update-status/${id}/${StatusFunction.EXCLUIDO}`);
    }

    approved(id: number): Observable<Response> {
        return this.http.get<Response>(`${this.resourceUrl}/update-status/${id}/${StatusFunction.VALIDADO}`);
    }

    pending(id: number): Observable<Response> {
        return this.http.get<Response>(`${this.resourceUrl}/update-status/${id}/${StatusFunction.DIVERGENTE}`);
    }

    saveComent(comment: String, idStatus: number) {
        return this.http.post<CommentFuncaoDados>(`${this.resourceUrlComment}/${idStatus}`, comment);
    }


    private convertResponse(res): ResponseWrapper {
        const jsonResponse = res;
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItem(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    private convertItem(json: any): FuncaoDados {
        return FuncaoDados.convertJsonToObject(json);
    }

    private convertResponseFuncaoDados(res): ResponseWrapper {
        const jsonResponse = res;
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

    create(funcaoDados: FuncaoDados, idAnalise: Number, files: File[]): Observable<any> {
        let body = new FormData();
        if (files) {
            for (let i = 0; i < files.length; i++) {
                body.append('file', files[i]);
            }
        }

        const json = JSON.stringify(funcaoDados);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        body.append('funcaoDados', blob);
        
        return this.http.post(`${this.resourceUrl}/${idAnalise}`, body);
    }

    createDivergence(funcaoDados: FuncaoDados, idAnalise: Number, files: File[]): Observable<any> {
        let body = new FormData();
        if (files) {
            for (let i = 0; i < files.length; i++) {
                body.append('file', files[i]);
            }
        }

        const json = JSON.stringify(funcaoDados);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        body.append('funcaoDados', blob);
        
        funcaoDados.statusFuncao = StatusFunction.DIVERGENTE;
        return this.http.post(`${this.resourceUrl}/${idAnalise}`, body);
    }

    update(funcaoDados: FuncaoDados, files: File[]): Observable<any> {
        let body = new FormData();
        if (files) {
            for (let i = 0; i < files.length; i++) {
                body.append('file', files[i]);
            }
        }

        const json = JSON.stringify(funcaoDados);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        body.append('funcaoDados', blob);
        
        const copy = funcaoDados.toJSONState();
        
        return this.http.put(`${this.resourceUrl}/${copy.id}`, body).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(error);
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    existsWithName(name: String, idAnalise: number, idFuncionalade: number, idModulo: number, id: number = 0): Observable<Boolean> {
        const url = `${this.resourceUrl}/${idAnalise}/${idFuncionalade}/${idModulo}?name=${name}&id=${id}`;
        
        return this.http.get<Boolean>(url);
    }
    public getVWFuncaoDadosByIdAnalise(id: Number): Observable<any[]> {
        const url = `${this.vwresourceUrl}/${id}`;
        return this.http.get<[]>(url);
    }
    public getFuncaoDadosByModuloOrFuncionalidade(idSistema: Number, nome?: String, idModulo?: Number, idFuncionalidade?: Number): Observable<any[]> {
        const url = `${this.resourceUrlPEAnalitico}funcaoDados/${idSistema}?name=${nome}&idModulo=${idModulo}&idFuncionalidade=${idFuncionalidade}`;
        return this.http.get<[]>(url);
    }
}
enum StatusFunction {
    DIVERGENTE = 'DIVERGENTE',
    EXCLUIDO = 'EXCLUIDO',
    VALIDADO = 'VALIDADO',
  }