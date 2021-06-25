import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Analise } from '../analise';
import { Organizacao } from '../organizacao/organizacao.model';
import { Sistema } from '../sistema/sistema.model';
import { PerfilOrganizacao } from './perfil-organizacao.model';
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
            switch (error.headers.get('x-abacoapp-error')) {
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
            switch (error.headers.get('x-abacoapp-error')) {
                case 'error.nameexists':
                    this.pageNotificationService.addErrorMessage(this.getLabel('Este nome de perfil já existe.'));
                    return Observable.throw(new Error(error.status));
                case 'error.perfilativo':
                    this.pageNotificationService.addErrorMessage(this.getLabel('Não pode deixar inativo um perfil associado a um usuário.'));
                    return Observable.throw(new Error(error.status));
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

    getAllPerfis(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(`${this.resourceUrl}`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));;
    }

    getAllPerfisAtivo(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(`${this.resourceUrl}/ativo`).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));;
    }


    getAllPermissoes(): Observable<Permissao[]> {
        return this.http.get<Permissao[]>(this.resourcePermissaoUrl).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    getPermissao(id: number): Observable<Permissao> {
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

    dropDown(): Observable<Perfil[]> {
        return this.http.get<Perfil[]>(this.resourceUrl + '/drop-down');
    }

    getPerfilOrganizacaoByUser(): Observable<PerfilOrganizacao[]> {
        return this.http.get<PerfilOrganizacao[]>(`${environment.apiUrl}/perfil-organizacao/user-logado`);
    }

    public static consultarPerfilFuncionalidade(funcionalidade: string, acao: string, perfil: Perfil) {
        let canContinue: boolean = false;
        perfil.permissaos.forEach(permissao => {
            if (permissao.acao.sigla === acao && permissao.funcionalidadeAbaco.sigla === funcionalidade) {
                canContinue = true;
            }
        })
        return canContinue;
    }

    public static consultarPerfilOrganizacao(funcionalidade: string, acao: string, perfisOrganizacao: PerfilOrganizacao[], organizacao: Organizacao) {
        let canContinue: boolean = false;
        for (let i = 0; i < perfisOrganizacao.length; i++) {
            let perfilOrganizacao = perfisOrganizacao[i];
            if (this.consultarPerfilFuncionalidade(funcionalidade, acao, perfilOrganizacao.perfil) === true) {
                for (let j = 0; j < perfilOrganizacao.organizacoes.length; j++) {
                    let organizacaoPerfil = perfilOrganizacao.organizacoes[j];
                    if (organizacaoPerfil.id !== organizacao.id) {
                        canContinue = false
                    } else {
                        return true;
                    }
                }
            } else {
                canContinue = false;
            }
        }
        return canContinue;
    }

    public static consultarPerfil(funcionalidade: string, acao: string, perfisOrganizacao: PerfilOrganizacao[], lista: any){
        let canContinue: boolean = false;
        for (let i = 0; i < perfisOrganizacao.length; i++) {
            let perfilOrganizacao = perfisOrganizacao[i];
            if (this.consultarPerfilFuncionalidade(funcionalidade, acao, perfilOrganizacao.perfil) === true) {
                for (let j = 0; j < perfilOrganizacao.organizacoes.length; j++) {
                    let organizacaoPerfil = perfilOrganizacao.organizacoes[j];
                    if (organizacaoPerfil.id !== lista.id) {
                        canContinue = false
                    } else {
                        return true;
                    }
                }
            } else {
                canContinue = false;
            }
        }
        return canContinue;
    }

    public static consultarPerfilSistema(funcionalidade: string, acao: string, perfisOrganizacao: PerfilOrganizacao[], sistema: Sistema) {
        let canContinue: boolean = false;
        for (let i = 0; i < perfisOrganizacao.length; i++) {
            let perfilOrganizacao = perfisOrganizacao[i];
            if (this.consultarPerfilFuncionalidade(funcionalidade, acao, perfilOrganizacao.perfil) === true) {
                for (let j = 0; j < perfilOrganizacao.organizacoes.length; j++) {
                    let organizacaoPerfil = perfilOrganizacao.organizacoes[j];
                    if (organizacaoPerfil.id !== sistema.organizacao.id) {
                        canContinue = false
                    } else {
                        return true;
                    }
                }
            } else {
                canContinue = false;
            }
        }
        return canContinue;
    }

    public static consultarPerfilAnalise(funcionalidade: string, acao: string, perfisOrganizacao: PerfilOrganizacao[], analise: Analise) {
        let canContinue: boolean = false;
        for (let i = 0; i < perfisOrganizacao.length; i++) {
            let perfilOrganizacao = perfisOrganizacao[i];
            if (this.consultarPerfilFuncionalidade(funcionalidade, acao, perfilOrganizacao.perfil) === true) {
                for (let j = 0; j < perfilOrganizacao.organizacoes.length; j++) {
                    let organizacaoPerfil = perfilOrganizacao.organizacoes[j];
                    if (organizacaoPerfil.id !== analise.organizacao.id) {
                        canContinue = false
                    } else {
                        return true;
                    }
                }
            } else {
                canContinue = false;
            }
        }
        return canContinue;
    }
}
