import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Response, RequestMethod, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

import { Analise, AnaliseShareEquipe } from './';
import { ResponseWrapper, createRequestOption, JhiDateUtils, PageNotificationService } from '../shared';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { loginRoute } from '../login';
import { GenericService } from '../util/service/generic.service';

@Injectable()
export class AnaliseService {

  resourceUrl = environment.apiUrl + '/analises';

  relatoriosUrl = environment.apiUrl + '/relatorioPdfBrowser';

  findByOrganizacaoUrl = this.resourceUrl + '/organizacao';

  findCompartilhadaByAnaliseUrl = environment.apiUrl + '/compartilhada';

  relatorioAnaliseUrl = environment.apiUrl + '/relatorioPdfArquivo';

  relatoriosDetalhadoUrl = environment.apiUrl + '/downloadPdfDetalhadoBrowser';

  relatorioExcelUrl = environment.apiUrl + '/downloadRelatorioExcel';

  searchUrl = environment.apiUrl + '/_search/analises';

  relatoriosBaselineUrl = environment.apiUrl + '/downloadPdfBaselineBrowser';

  @BlockUI() blockUI: NgBlockUI;

  constructor(private http: HttpService, private pageNotificationService: PageNotificationService, private genericService: GenericService, private translate: TranslateService) { }

  getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
      str = res;
    }).unsubscribe();
    return str;
  }

  /**
   *
   */
  public create(analise: Analise): Observable<Analise> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.CriandoAnálise'));
    const copy = this.convert(analise);
    return this.http.post(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      this.blockUI.stop();
      return this.genericService.convertJsonToObject(res.json(), new Analise())
    }).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
  }

  /**
   * atualizaAnalise
   */
  public atualizaAnalise(analise: Analise) {
    this.update(analise)
      .subscribe();
  }


  /**
   *
   */
  public update(analise: Analise): Observable<Analise> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.AtualizandoAnalise'));
    const copy = this.convert(analise);
    return this.http.put(this.resourceUrl, copy).map((res: Response) => {
      const jsonResponse = res.json();
      this.blockUI.stop();
      return this.convertItemFromServer(jsonResponse);
    }).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
  }

  /**
   *
   */
  public block(analise: Analise): Observable<Analise> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.BloqueandoDesbloqueandoAnalise'));
    const copy = analise;
    return this.http.put(`${this.resourceUrl}/${copy.id}/block`, copy).map((res: Response) => {
      this.blockUI.stop();
      return null;
    }).catch((error: any) => {
      switch (error.status) {
        case 400: {
          if (error.headers.toJSON()['x-abacoapp-error'][0] === 'error.notadmin') {
            this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.msgSomenteAdministradoresBloquearDesbloquear'));
          }
          break;
        }
        case 403: {
          this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
          break;
        }
      }
      return Observable.throw(new Error(error.status));
    });
  }



  /**
   *
   */
  public gerarRelatorioPdfArquivo(id: number) {
    window.open(`${this.relatorioAnaliseUrl}/${id}`);
  }

  /**
   *
   */
  public geraRelatorioPdfBrowser(id: number): Observable<string> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
    this.http.get(`${this.relatoriosUrl}/${id}`, {
      method: RequestMethod.Get,
      responseType: ResponseContentType.Blob,
    }).subscribe(
      (response) => {
        const mediaType = 'application/pdf';
        const blob = new Blob([response.blob()], { type: mediaType });
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
  public geraRelatorioPdfDetalhadoBrowser(id: number): Observable<string> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
    this.http.get(`${this.relatoriosDetalhadoUrl}/${id}`, {
      method: RequestMethod.Get,
      responseType: ResponseContentType.Blob,
    }).catch((error: any) => {
      if (error.status === 500) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.ErroGerarRelatorio'));
        this.blockUI.stop();
        return Observable.throw(new Error(error.status));
      }
    }).subscribe(
      (response) => {
        const mediaType = 'application/pdf';
        const blob = new Blob([response.blob()], { type: mediaType });
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'analise.pdf';
        anchor.href = fileURL;
        document.body.appendChild(anchor);
        anchor.click();
        this.blockUI.stop();
        return null;
      });
    return null;
  }

  /**
   *
   */
  public gerarRelatorioExcel(id: number): Observable<string> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
    this.http.get(`${this.relatorioExcelUrl}/${id}`, {
      method: RequestMethod.Get,
      responseType: ResponseContentType.Blob,
    }).catch((error: any) => {
      this.blockUI.stop();
      if (error.status === 500) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Analise.Analise.Mensagens.ErroGerarRelatorio'));
        this.blockUI.stop();
        return Observable.throw(new Error(error.status));
      }
    }).subscribe(
      (response) => {
        const mediaType = 'application/vnd.ms-excel';
        const blob = new Blob([response.blob()], { type: mediaType });
        const fileURL = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = 'analise.xls';
        anchor.href = fileURL;
        document.body.appendChild(anchor);
        anchor.click();
        this.blockUI.stop();
        return null;
      });
    return null;
  }

  /**
   *
   */
  public geraBaselinePdfBrowser(): Observable<string> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.GerandoRelatorio'));
    this.http.get(`${this.relatoriosBaselineUrl}`, {
      method: RequestMethod.Get,
      responseType: ResponseContentType.Blob,
    }).subscribe(
      (response) => {
        const mediaType = 'application/pdf';
        const blob = new Blob([response.blob()], { type: mediaType });
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
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.ProcurandoAnalise'));
    return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
      const jsonResponse = res.json();
      const analiseJson = this.convertItemFromServer(jsonResponse);
      analiseJson.createdBy = jsonResponse.createdBy;
      this.blockUI.stop();
      return analiseJson;
    });
  }

  findAllByOrganizacaoId(orgId: number): Observable<ResponseWrapper> {
    const url = `${this.findByOrganizacaoUrl}/${orgId}`;
    return this.http.get(url)
      .map((res: Response) => this.convertResponse(res));
  }

  /** Encontra todas as análises referentes às equipes do usuário.
   *
   * @param idUsuario Id do usuário que está fazendo a requisição
   */
  findAnalisesUsuario(idUsuario: number): Observable<Analise[]> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.FiltrandoAnalises'));
    const url = `${this.resourceUrl}/user/${idUsuario}`;
    return this.http.get(url)
      .map(
        (res: Response) => this.convertJsonToAnalise(res),
        (error) => this.tratarErro(error.toString(), idUsuario)
      );
  }

  tratarErro(erro: string, id: number) { }
  /**
   *
   */
  public query(req?: any): Observable<ResponseWrapper> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.AguardeUmMomento'));
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl, options)
      .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
        if (error.status === 403) {
          this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
          return Observable.throw(new Error(error.status));
        }
      });
  }

  /**
   *
   */
  public delete(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
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
    this.blockUI.stop();
    return new ResponseWrapper(res.headers, result, res.status);
  }

  /**
   * Convert a returned JSON object to Analise.
   */
  private convertItemFromServer(json: any): Analise {
    return new Analise().copyFromJSON(json);
  }

  convertJsonToAnalise(res: Response): Analise[] {
    const jsonResponse = res.json();
    let result = [];
    for (let i = 0; i < jsonResponse.length; i++) {
      result.push(this.convertItemFromServer(jsonResponse[i]));
    }
    this.blockUI.stop();
    return result;
  }
  /**
   * Convert a Analise to a JSON which can be sent to the server.
   */
  private convert(analise: Analise): Analise {
    return analise.toJSONState();
  }

  // PARTE RESPONSÁVEL PELO "COMPARTILHAR"

  /** Encontra todas as equipes que têm acesso àquela análise
  *
  *
  */
  findAllCompartilhadaByAnalise(analiseId: number): Observable<ResponseWrapper> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.BuscandoAnalises'));
    const url = `${this.findCompartilhadaByAnaliseUrl}/${analiseId}`;
    return this.http.get(url)
      .map((res: Response) => this.convertResponse(res));
  }



  findAllBaseline(): Observable<Response> {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.BuscandoAnalisesBaseline'));
    const url = `${this.resourceUrl}/baseline`;
    return this.http.get(url);
  }

  /** Salva as equipes que têm acesso àquela análise
  *
  *
  */
  salvarCompartilhar(listaCompartilhada: Array<AnaliseShareEquipe>) {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.CompartilhandoAnalise'));
    return this.http.post(`${this.resourceUrl}/compartilhar`, listaCompartilhada).map((res: Response) => {
      const jsonResponse = res.json();
      this.blockUI.stop();
      return jsonResponse;
    });
  }

  /** Deletas as equipes que têm acesso àquela análise
  *
  *
  */
  deletarCompartilhar(id: number): Observable<Response> {
    return this.http.delete(`${this.resourceUrl}/compartilhar/delete/${id}`).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
  }

  /**Atualiza um compartilhamento para "Somente visualizar ou Editar"
  *
  *
  */
  atualizarCompartilhar(compartilhada) {
    this.blockUI.start(this.getLabel('Analise.Analise.Mensagens.AtualizandoCompartilhamento'));
    const copy = compartilhada;
    return this.http.put(`${this.resourceUrl}/compartilhar/viewonly/${copy.id}`, copy).map((res: Response) => {
      this.blockUI.stop();
      return null;
    }).catch((error: any) => {
      if (error.status === 403) {
        this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
        return Observable.throw(new Error(error.status));
      }
    });
  }
}
