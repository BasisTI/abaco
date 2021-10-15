import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Der } from './der.model';


@Injectable()
export class DerService {

    resourceUrl = environment.apiUrl + '/ders';

    constructor(private http: HttpClient) {
    }

    dropDownByFuncaoDadosId(idFuncaoDados: number): Observable<any> {
        return this.http.get<any>(this.resourceUrl + '/drop-down/' + idFuncaoDados);
    }

    dropDownByFuncaoTransacaoId(idFuncaoTransacao: number): Observable<any> {
        return this.http.get<any>(this.resourceUrl + '/drop-down/ft/' + idFuncaoTransacao);
    }

    getDersFuncaoDadosByNomeSistema(nome: string, idSistema: number): Observable<Der[]>{
        return this.http.get<Der[]>(this.resourceUrl + "/funcao_dados/sistema/"+ idSistema + "?nome="+nome);
    }

    getDersFuncaoTransacaoByNomeSistema(nome: string, idSistema: number): Observable<Der[]>{
        return this.http.get<Der[]>(this.resourceUrl + "/funcao_transacao/sistema/"+ idSistema + "?nome="+nome);
    }

    
    getDersByFuncaoDadosId(idFuncaoDados: number): Observable<any> {
        return this.http.get<any>(this.resourceUrl + '/fd/' + idFuncaoDados);
    }

    getDersByFuncaoTransacaoId(idFuncaoTransacao: number): Observable<any> {
        return this.http.get<any>(this.resourceUrl + '/ft/' + idFuncaoTransacao);
    }
}
