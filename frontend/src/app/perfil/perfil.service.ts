import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Perfil } from './perfil.model';
import { Acao, FuncionalidadeAbaco, Permissao } from './permissao.model';


@Injectable()
export class PerfilService {

    resourceName = '/perfils';
    resourcePermissaoName = '/permissaos'

    searchUrl = environment.apiUrl + '/_search/perfil';

    resourceUrl = environment.apiUrl + this.resourceName;
    resourcePermissaoUrl = environment.apiUrl + this.resourcePermissaoName;

    constructor(
        private http: HttpClient,
        private pageNotificationService: PageNotificationService
    ) {
    }

    create(perfil: Perfil): Observable<Perfil> {
        return this.http.post<Perfil>(this.resourceUrl, perfil).pipe(catchError((error: any) => {
            switch(error.headers.get('x-abacoapp-error')){
                case 'error.nameexists':
                    this.pageNotificationService.addErrorMessage(this.getLabel('Este nome de perfil já existe.'));
                    return Observable.throw(new Error(error.status));
                    break;
            }
        }));
    }

    find(id: number): Observable<Perfil> {
        return this.http.get<Perfil>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    update(perfil: Perfil): Observable<Perfil> {
        return this.http.put<Perfil>(this.resourceUrl, perfil).pipe(catchError((error: any) => {
            switch(error.headers.get('x-abacoapp-error')){
                case 'error.nameexists':
                    this.pageNotificationService.addErrorMessage(this.getLabel('Este nome de perfil já existe.'));
                    return Observable.throw(new Error(error.status));
                    break;
            }
        }));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
            if (error.error.message == "UsuarioRelacionado") {
                this.pageNotificationService.addErrorMessage(this.getLabel('Não pode excluir um perfil associado um usuário'));
                return Observable.throw(new Error(error.status));
            }

            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    getAllPerfis(): Observable<Perfil[]>{
        return this.http.get<Perfil[]>(`${this.resourceUrl}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));;
    }

    getAllPerfisAtivo(): Observable<Perfil[]>{
        return this.http.get<Perfil[]>(`${this.resourceUrl}/ativo`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));;
    }


    getAllPermissoes(): Observable<Permissao[]>{
        return this.http.get<Permissao[]>(this.resourcePermissaoUrl).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    getPermissao(id: number): Observable<Permissao>{
        return this.http.get<Permissao>(`${this.resourcePermissaoUrl}/${id}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    getLabel(label) {
        return label;
    }


}
