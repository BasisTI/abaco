import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';

import {ResponseWrapper, createRequestOption, JhiDateUtils} from '../shared';
import {FuncaoDados} from '.';
import {Analise} from '../analise/analise.model';
import {tap} from 'rxjs/operators';
import {HttpResponse} from '@angular/common/http';

@Injectable()
export class FuncaoDadosService {

    sistemaResourceUrl = environment.apiUrl + '/funcao-dados';

    constructor(private http: HttpService) {
    }

    findAllNamesBySistemaId(sistemaId: number): Observable<string[]> {
        const url = `${this.sistemaResourceUrl}/${sistemaId}/funcao-dados`;
        return this.http.get(url)
            .map((res: Response) => res.json().map(json => json.nome));
    }

    recuperarFuncaoDadosPorIdNome(id: number, nome: string): Observable<FuncaoDados> {
        const url = `${this.sistemaResourceUrl}/${id}/funcao-dados-versionavel/${nome}`;
        return this.http.get(url)
            .map((res: Response) => res.json());
    }

    public getFuncaoDadosAnalise(id: number): Observable<FuncaoDados> {
        return this.http.get(`${this.sistemaResourceUrl}/analise/${id}`)
            .map((res: Response) => res.json());
        };

}
