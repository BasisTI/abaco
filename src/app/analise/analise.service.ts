import { Injectable } from '@angular/core';
import { Response, RequestMethod, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Analise } from './analise.model';
import { ResponseWrapper, createRequestOption, JhiDateUtils } from '../shared';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable()
export class AnaliseService {

  resourceUrl = environment.apiUrl + '/analises';

  relatoriosUrl = environment.apiUrl + '/relatorios';

  searchUrl = environment.apiUrl + '/_search/analises';

  relatorioAnaliseUrl = environment.apiUrl + '/relatorioAnalise';

  @BlockUI() blockUI: NgBlockUI;

  constructor(private http: HttpService) {}

  /**
   *
   */
  public create(analise: Analise): Observable<Analise> {
    const copy = this.convert(analise);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  /**
   *
   */
  public update(analise: Analise): Observable<Analise> {
    const copy = this.convert(analise);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  /**
   *
   */
  public gerarRelatorioAnalise(id: number) {
    window.open(`${this.relatorioAnaliseUrl}/${id}`);
  }

  /**
   *
   */
  public geraRelatorioPDF(id: number): Observable<string> {
    this.blockUI.start('GERANDO RELATORIO...');
    this.http.get(`${this.relatoriosUrl}/${id}`, {
    method: RequestMethod.Get,
    responseType: ResponseContentType.Blob,
  }).subscribe(
      (response) => {
        const mediaType = 'application/pdf';
        const blob = new Blob([response.blob()], {type: mediaType});
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'analise.pdf';
        anchor.href = fileURL;
        window.open(fileURL, '_blank', '');
        this.blockUI.stop();
        return null;
      });
      return null;
  }

  /**
   *
   */
  public find(id: number): Observable<Analise> {
    return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
      const jsonResponse = res.json();
      return this.convertItemFromServer(jsonResponse);
    });
  }

  /**
   *
   */
  public query(req?: any): Observable<ResponseWrapper> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl, options)
    .map((res: Response) => this.convertResponse(res));
  }

  /**
   *
   */
  public delete(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  /**
   *
   */
  private convertResponse(res: Response): ResponseWrapper {
    const jsonResponse = res.json();
    const result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertItemFromServer(jsonResponse[i]));
    }
    return new ResponseWrapper(res.headers, result, res.status);
  }

  /**
   * Convert a returned JSON object to Analise.
   */
  private convertItemFromServer(json: any): Analise {
    return new Analise().copyFromJSON(json);
  }

  /**
   * Convert a Analise to a JSON which can be sent to the server.
   */
  private convert(analise: Analise): Analise {
    return analise.toJSONState();
  }
}
