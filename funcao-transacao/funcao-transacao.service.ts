import { FuncaoTransacao } from './funcao-transacao.model';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Analise } from '../analise/analise.model';
import { CommentFuncaoTransacao } from './comment.model';


@Injectable()
export class FuncaoTransacaoService {

    vwFuncaoTransacaoResourceUrl = environment.apiUrl + '/vw-funcao-transacaos';
    resourceUrlComment = environment.apiUrl + '/comment/funcao-transacao';
    funcaoTransacaoResourceUrl = environment.apiUrl + '/funcao-transacaos';
    resourceUrlPEAnalitico = environment.apiUrl + '/peanalitico/';
    allFuncaoTransacaosUrl = this.funcaoTransacaoResourceUrl + '/completa';

    public display = new Subject<boolean>();
    display$ = this.display.asObservable();

    constructor(private http: HttpClient, private pageNotificationService: PageNotificationService) {
    }

    autoCompletePEAnalitico(name: String, idFuncionalidade : number): Observable<any> {
        const url = `${this.resourceUrlPEAnalitico}ft?name=${name}&idFuncionalidade=${idFuncionalidade}`;
        return this.http.get(url);
    }

    getFuncaoTransacaosCompleta(analiseId: number): Observable<FuncaoTransacao> {
        return this.http.get<FuncaoTransacao>(`${this.allFuncaoTransacaosUrl}/${analiseId}`);
    }

    private convertJsonToSinteticoTransacao(json: any): FuncaoTransacao {
        const entity: FuncaoTransacao = FuncaoTransacao.convertTransacaoJsonToObject(json);
        return entity;
    }

    public getFuncaoTransacaoByAnalise(analise: Analise): Observable<FuncaoTransacao[]> {
        const url = `${this.funcaoTransacaoResourceUrl}-dto/analise/${analise.id}`;
        return this.http.get<FuncaoTransacao[]>(url);
    }

    public getFuncaoTransacaoByIdAnalise(id: Number): Observable<any[]> {
        const url = `${this.funcaoTransacaoResourceUrl}-dto/analise/${id}`;
        return this.http.get<any[]>(url);
    }

    public convertItemFromServer(json: any): FuncaoTransacao {
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

    create(funcaoTransacao: FuncaoTransacao, idAnalise: Number, files?: File[]): Observable<any> {

        let body = new FormData();
        if (files) {
            for (let i = 0; i < files.length; i++) {
                body.append('files', files[i]);
            }
        }
        const json = JSON.stringify(funcaoTransacao);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        body.append('funcaoTransacao', blob);

        return this.http.post(`${this.funcaoTransacaoResourceUrl}/${idAnalise}`, body);
    }

    update(funcaoTransacao: FuncaoTransacao, files?: File[]) {
        let body = new FormData();
        if (files) {
            for (let i = 0; i < files.length; i++) {
                body.append('files', files[i]);
            }
        }
        const json = JSON.stringify(funcaoTransacao);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        body.append('funcaoTransacao', blob);

        return this.http.put(`${this.funcaoTransacaoResourceUrl}/${funcaoTransacao.id}`, body).pipe(catchError((error: any) => {
            if (error.name === 403) {
                this.pageNotificationService.addErrorMessage(error);
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.funcaoTransacaoResourceUrl}/${id}`);
    }

    deleteStatus(id: number): Observable<Response> {
        return this.http.get<Response>(`${this.funcaoTransacaoResourceUrl}/update-status/${id}/${StatusFunction.EXCLUIDO}`);
    }

    approved(id: number): Observable<Response> {
        return this.http.get<Response>(`${this.funcaoTransacaoResourceUrl}/update-status/${id}/${StatusFunction.VALIDADO}`);
    }

    pending(id: number): Observable<Response> {
        return this.http.get<Response>(`${this.funcaoTransacaoResourceUrl}/update-status/${id}/${StatusFunction.DIVERGENTE}`);
    }

    saveComent(comment: String, idStatus: number) {
        return this.http.post<CommentFuncaoTransacao>(`${this.resourceUrlComment}/${idStatus}`, comment);
    }

    existsWithName(name: String, idAnalise: number, idFuncionalade: number, idModulo: number, id: Number = 0): Observable<Boolean> {
        const url = `${this.funcaoTransacaoResourceUrl}/${idAnalise}/${idFuncionalade}/${idModulo}?name=${name}&id=${id}`;
        return this.http.get<Boolean>(url);
    }

    public getById(id: Number): Observable<FuncaoTransacao> {
        const url = `${this.funcaoTransacaoResourceUrl}/${id}`;
        return this.http.get<FuncaoTransacao>(url);
    }

    public getFuncaoTransacaoByModuloOrFuncionalidade(idSistema: Number, nome?: String, idModulo?: Number, idFuncionalidade?: Number): Observable<any[]> {
        const url = `${this.resourceUrlPEAnalitico}funcaoTransacao/${idSistema}?name=${nome}&idModulo=${idModulo}&idFuncionalidade=${idFuncionalidade}`;
        return this.http.get<[]>(url);
    }
    public getVwFuncaoTransacaoByIdAnalise(id: Number): Observable<any[]> {
        const url = `${this.vwFuncaoTransacaoResourceUrl}/${id}`;
        return this.http.get<[]>(url);
    }
}

enum StatusFunction {
    DIVERGENTE = 'DIVERGENTE',
    EXCLUIDO = 'EXCLUIDO',
    VALIDADO = 'VALIDADO',
}
