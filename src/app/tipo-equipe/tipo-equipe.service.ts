import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {createRequestOption, ResponseWrapper} from '../shared';
import {TipoEquipe} from './tipo-equipe.model';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnaliseShareEquipe } from '../analise';


@Injectable()
export class TipoEquipeService {

    resourceUrl = environment.apiUrl + '/tipo-equipes';

    findByOrganizacaoAndUserUrl = this.resourceUrl + '/current-user';
    findByOrganizacaoUrl = this.resourceUrl + '/organizacoes';
    findAllCompartilhaveisUrl = this.resourceUrl + '/compartilhar';

    searchUrl = environment.apiUrl + '/_search/tipo-equipes';

    constructor(private http: HttpClient, private pageNotificationService: PageNotificationService) {
    }

    getLabel(label) {

        return label;
    }

    create(tipoEquipe: TipoEquipe): Observable<TipoEquipe> {
        const copy = this.convert(tipoEquipe);
        return this.http.post(this.resourceUrl, copy).pipe(
        catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    update(tipoEquipe: TipoEquipe): Observable<TipoEquipe> {
        const copy = this.convert(tipoEquipe);
        return this.http.put(this.resourceUrl, copy).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    find(id: number): Observable<TipoEquipe> {
        return this.http.get(`${this.resourceUrl}/${id}`).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }
    getAll(): Observable<ResponseWrapper> {
        const url = `${this.findByOrganizacaoUrl}`;
        return this.http.get<ResponseWrapper>(url).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    findAllByOrganizacaoId(orgId: number): Observable<TipoEquipe[]> {
        const url = `${this.findByOrganizacaoUrl}/${orgId}`;
        return this.http.get<TipoEquipe[]>(url).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    findAllEquipesByOrganizacaoIdAndLoggedUser(orgId: number): Observable<TipoEquipe[]> {
        const url = `${this.findByOrganizacaoAndUserUrl}/${orgId}`;
        return this.http.get<TipoEquipe[]>(url).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    findAllCompartilhaveis(orgId, analiseId, equipeId: number): Observable<any[]> {
        const url = `${this.findAllCompartilhaveisUrl}/${orgId}/${analiseId}/${equipeId}`;
        return this.http.get<any[]>(url).pipe(
        catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }
    dropDown(): Observable<TipoEquipe[]> {
        return this.http.get<TipoEquipe[]>(this.resourceUrl + '/drop-down').pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    dropDownByUser(): Observable<TipoEquipe[]> {
        return this.http.get<TipoEquipe[]>(this.resourceUrl + '/user').pipe(
        catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    getEquipesActiveLoggedUser(req?: any): Observable<TipoEquipe[]> {
        const options = createRequestOption(req);
        return this.http.get<TipoEquipe[]>(this.resourceUrl + '/active-user').pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: any): TipoEquipe[] {
        const result:TipoEquipe[] = [];
        for (let i = 0; i < res.length; i++) {
            result.push(this.convertItemFromServer(res[i]));
        }
        return result;
    }

    private convertItemFromServer(json: any): TipoEquipe {
        const entity: TipoEquipe = Object.assign(new TipoEquipe(), json);
        return entity;
    }

    private convert(tipoEquipe: TipoEquipe): TipoEquipe {
        const copy: TipoEquipe = Object.assign({}, tipoEquipe);
        return copy;
    }
}
