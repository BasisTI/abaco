import {TipoEquipe} from './../tipo-equipe/tipo-equipe.model';
import {Organizacao} from './../organizacao/organizacao.model';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';


import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ResponseWrapper, createRequestOption } from '../shared';
import { Perfil } from '../perfil/perfil.model';

@Injectable()
export class UserService {

    resourceUrl = environment.apiUrl + '/users/';

    resourceDtoUrl = environment.apiUrl + '/users-dto/';

    searchUrl = environment.apiUrl + '/_search/users';


    constructor(private http: HttpClient, private pageNotificationService: PageNotificationService) {
    }

    getLabel(label) {
        return label;
    }

    create(user: User): Observable<User> {
        const copy = this.convert(user);
        return this.http.post<User>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            return this.handlerError(error);
        }));
    }

    update(user: User): Observable<User> {
        const copy = this.convert(user);
        return this.http.put<User>(this.resourceUrl, copy).pipe(catchError((error: any) => {
            return this.handlerError(error);
        }));
    }

    private handlerError(error: any) {
        switch (error.status) {
            case 400:
                this.handlerUserExistsError(error.headers);
                return Observable.throw(new Error(error.status));
            case 403:
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão para esta ação.'));
                return Observable.throw(new Error(error.status));
        }
    }

    private handlerUserExistsError(header: Headers) {
        switch (header.get('x-abacoapp-error')) {
            case 'error.userexists':
                this.pageNotificationService.addErrorMessage(this.getLabel('Este usuário já existe.'));
                break;
            case 'error.emailexists':
                this.pageNotificationService.addErrorMessage(this.getLabel('Este endereço de e-mail já está cadastrado'));
                break;
            case 'error.fullnameexists':
                this.pageNotificationService.addErrorMessage(this.getLabel('Este nome de usuário já está sendo usado.'));
                break;
        }
    }

    find(id: number): Observable<User> {
        return this.http.get<User>(`${this.resourceUrl}/${id}`).pipe(catchError((error: any) => {
            return this.handlerError(error)}));
    }

    getAllUsers(org: Organizacao, tipoequip: TipoEquipe): Observable<User[]> {
        return this.http.get<User[]>(`${this.resourceDtoUrl}/${org.id}/${tipoequip.id}`).pipe(
            catchError((error: any) => {
            return this.handlerError(error)}));
    }

    /**
     * Função que retorna dados do usuário logado
     */
    findCurrentUser(): Observable<User> {
        return this.http.get<User>(`${this.resourceUrl}/logged`).pipe(
            catchError((error: any) => {
            return this.handlerError(error)}));
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get<ResponseWrapper>(this.resourceUrl).pipe(
            catchError((error: any) => {
            return this.handlerError(error)}));
    }

    delete(user: User): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${user.id}`);
    }

    getLoggedUserWithId(): Observable<User> {
        return this.http.get<User>(this.resourceUrl + '/active-user').pipe(
        catchError((error: any) => {
            return this.handlerError(error)}));
    }

    public convertResponse(res: any): User[] {
        const result: User[] = [];
        for (let i = 0; i < res.length; i++) {
            result.push(new User().copyFromJSON(res[i]));
        }
        return result;
    }

    private convertItemFromServer(json: any): User {
        const entity: User = Object.assign(new User(), json);
        entity.perfils  = this.generateAuthorities(json);
        return entity;
    }

    public convertUsersFromServer(json: any): User[] {
        const users: User[] = [];
        json.map(item => {
            const entity: User = Object.assign(new User(), item);
            entity.perfils = this.generateAuthorities(item);
            users.push(entity);
        });
        return users;
    }

    // TODO User implements JSONable
    private generateAuthorities(json: any) {
        let perfils: Perfil[] = [];
        if (json.perfils) {
            perfils = json.perfils.map(a => new Perfil(a.nome));
        }
        return perfils;
    }

    private convert(user: User): User {
        const copy: User = Object.assign({}, user);
        return copy;
    }

    dropDown(): Observable<User[]> {
        return this.http.get<User[]>(this.resourceUrl + '/drop-down').pipe(
            catchError((error: any) => {
            return this.handlerError(error)}));
    }

    getUsersFromOrganização(organizacoes: any[]): Observable<User[]>{
        return this.http.post<User[]>(this.resourceUrl + 'drop-down/organizacao',organizacoes)
        .pipe(catchError((error: any) => {
            return this.handlerError(error)}));
    }
}
