import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';
import { FuncaoDados } from '.';

@Injectable()
export class FuncaoDadosService {

  sistemaResourceUrl = environment.apiUrl + '/sistemas';

  constructor(private http: HttpService) { }

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

}
