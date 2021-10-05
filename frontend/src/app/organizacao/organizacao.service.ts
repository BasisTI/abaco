import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UploadService } from '../upload/upload.service';
import { Organizacao } from './organizacao.model';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { ResponseWrapper, createRequestOption } from '../shared';
import { catchError } from 'rxjs/operators';
import { BlockUiService } from '@nuvem/angular-base';


@Injectable()
export class OrganizacaoService {

    resourceName = '/organizacaos';

    resourceUrl = environment.apiUrl + this.resourceName;

    searchUrl = environment.apiUrl + '/_search' + this.resourceName;

    findActive = environment.apiUrl + this.resourceName + '/active';

    relatorioOrganizacaoUrl = environment.apiUrl + this.resourceName + "/exportacaoPDF";

    constructor(
        private http: HttpClient,
        private uploadService: UploadService,
        private pageNotificationService: PageNotificationService,
        private blockUiService: BlockUiService
    ) { }

    create(organizacao: Organizacao): Observable<any> {
        const copy = this.convertToJSON(organizacao);
        return this.http.post(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    update(organizacao: Organizacao): Observable<Organizacao> {
        const copy = this.convertToJSON(organizacao);
        return this.http.put<Organizacao>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    find(id: number): Observable<Organizacao> {
        return this.http.get<Organizacao>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    /**
   * Função que retorna dados do usuário logado somente com as organizações ativas
   */
    dropDownActiveLoggedUser(): Observable<Organizacao[]> {
        return this.http.get<Organizacao[]>(this.resourceUrl + '/active-user');
    }

    dropDown(): Observable<Organizacao[]> {
        return this.http.get<Organizacao[]>(this.resourceUrl + '/drop-down')
            .pipe(catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage('Você não possui permissão!');
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    dropDownActive(): Observable<Organizacao[]> {
        return this.http.get<Organizacao[]>(this.resourceUrl + '/drop-down/active')
            .pipe(catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage('Você não possui permissão!');
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    searchActiveOrganizations(req?: any): Observable<Organizacao[]> {
        const options = createRequestOption(req);
        return this.http.get<Organizacao[]>(this.resourceUrl + '/ativas').pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage('VoceNaoPossuiPermissao');
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    // private convertResponseToResponseWrapper(res: Response): ResponseWrapper {
    //   const jsonResponse = res.json();
    //   const result = [];
    //   for (let i = 0; i < jsonResponse.length; i++) {
    //     result.push(this.convertFromJSON(jsonResponse[i]));
    //   }
    //   return new ResponseWrapper(res.headers, result, res.status);
    // }

    // private convertFromJSON(json: any): Organizacao {
    //   const entity: JSONable<Organizacao> = new Organizacao();
    //   return entity.copyFromJSON(json);
    // }

    private convertToJSON(organizacao: Organizacao): Organizacao {
        const copy: Organizacao = Object.assign({}, organizacao);
        return copy;
    }
}
