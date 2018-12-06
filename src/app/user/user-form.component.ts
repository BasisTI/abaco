import {Component, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import {Response} from '@angular/http';
import {Observable, Subscription} from 'rxjs/Rx';
import {SelectItem} from 'primeng/primeng';

import {AuthService} from '@basis/angular-components';
import {User} from './user.model';
import {UserService} from './user.service';
import {TipoEquipe, TipoEquipeService} from '../tipo-equipe';
import {Organizacao, OrganizacaoService} from '../organizacao';
import {ResponseWrapper} from '../shared';
import {Authority} from './authority.model';
import {PageNotificationService} from '../shared/page-notification.service';
import {ADMIN_ROLE} from '../shared/constants';

import * as _ from 'lodash';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';
import {MessageUtil} from '../util/message.util';
import {element} from 'protractor';

@Component({
    selector: 'jhi-user-form',
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit, OnDestroy {

    tipoEquipes: TipoEquipe[];

    organizacoes: Organizacao[];

    authorities: Authority[];

    user: User;

    isSaving: boolean;

    isEdit: boolean;

    // O usuário logado é admin? - Flag utilizada para desabilitar os campos que usuário o comum não pode alterar.
    isAdmin: boolean;

    private routeSub: Subscription;
    private urlSub: Subscription;     // Subscritor para capturar a URL ativa

    // URL ativa - utilizado para verificar se o componente foi ativado pelo menu de administração ou de edição de usuário
    private url: string;
    emaild: any;

    constructor(
        private authService: AuthService<User>,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private tipoEquipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
    ) {
        this.isAdmin = this.isUserAdmin();    // Seta a flag de administrador (ou não) e...
        this.recuperarUrl();                  // Capturando URL ativa
        if (this.url === 'usuario,edit') {    // Se for uma edição de usuário..
            this.loadCurrentUser();             // Carrrega os dados do usuário logado,
            this.isEdit = true;                 // Levanta flag de edição,
        }
    }

    ngOnInit() {
        this.isSaving = false;
        this.recuperarListaOrganizacao();
        this.recuperarListaPerfis();
        this.recuperarUsuarioPeloId();
    }

    private recuperarListaOrganizacao() {
        this.organizacaoService.findActiveOrganizations().subscribe((res) => {
            this.organizacoes = res;
        });
    }

    private recuperarListaPerfis() {
        this.userService.authorities().subscribe((res: Authority[]) => {
            this.authorities = res;
            this.populateAuthoritiesArtificialIds();
        });
    }

    /*
     * Função parar recuperar a URL que ativou o componente.
     * Utlizada para verificar se foi ativado pelo menu de administração
     * ou pelo menu de edição de usuário
     * */
    private recuperarUrl() {
        this.urlSub = this.route.url.subscribe((res: UrlSegment[]) => {
            this.url = res.toString();
        });
    }

    private recuperarUsuarioPeloId() {
        this.routeSub = this.route.params.subscribe(params => {
            this.user = new User();
            this.user.activated = true;
            if (params['id']) {
                this.userService.find(params['id']).subscribe(user => {
                    this.user = user;
                    this.setEquipeOrganizacao(this.user.organizacoes);
                    this.populateUserAuthoritiesWithArtificialId();
                });
            }
        });
    }

    // FIXME parte da solução rápida e ruim, porém dinâmica
    // Horrível para muitas permissões
    private populateAuthoritiesArtificialIds() {
        this.authorities.forEach((authority, index) => {
            authority.artificialId = index;
            switch (index) {
                case 0: {
                    authority.description = 'Administrador';
                    break;
                }

                case 1: {
                    authority.description = 'Usuário';
                    break;
                }

                case 2: {
                    authority.description = 'Observador';
                    break;
                }

                case 3: {
                    authority.description = 'Analista';
                    break;
                }

                case 4: {
                    authority.description = 'Gestor';
                    break;
                }
            }
        });
    }

    // FIXME Solução rápida e ruim. O(n^2) no pior caso
    // Funciona para qualquer autoridade que vier no banco
    // Em oposição a uma solução mais simples porém hardcoded.
    private populateUserAuthoritiesWithArtificialId() {
        this.user.authorities.forEach(authority => {
            switch (authority.name) {
                case 'ROLE_ADMIN': {
                    authority.description = 'Administrador';
                    authority.artificialId = 0;
                    break;
                }

                case 'ROLE_USER': {
                    authority.description = 'Usuário';
                    authority.artificialId = 1;
                    break;
                }

                case 'ROLE_VIEW': {
                    authority.description = 'Observador';
                    authority.artificialId = 2;
                    break;
                }
                case 'ROLE_ANALISTA': {
                    authority.description = 'Analista';
                    authority.artificialId = 3;
                    break;
                }
                case 'ROLE_GESTOR': {
                    authority.description = 'Gestor';
                    authority.artificialId = 4;
                    break;
                }

            }
        });
    }

    /**
     *
     * */
    save(form) {
        if (!form.valid) {
            this.pageNotificationService.addErrorMsg('Favor preencher os campos Obrigatórios!');
            if (!form.controls.email.valid && this.user.email) {
                this.pageNotificationService.addErrorMsg('E-mail Inválido');
            }
            return;
        }

        if (this.user.id !== undefined) {
            this.isEdit = true;
            this.subscribeToSaveResponse(this.userService.update(this.user));
        } else {
            this.subscribeToSaveResponse(this.userService.create(this.user));
        }
    }

    /**
     *
     * */
    private isUsernamesValid(): boolean {
        let isValid = false;
        this.returnInputToNormalStyle();
        let isFirstNameValid = false;
        let isLastNameValid = false;
        let isLoginValid = false;

        isFirstNameValid = this.validarObjeto(this.user.firstName);
        isLastNameValid = this.validarObjeto(this.user.lastName);
        isLoginValid = this.validarObjeto(this.user.login);

        if (isFirstNameValid && isLastNameValid && isLoginValid) {
            isValid = true;
        } else {
            this.pageNotificationService.addErrorMsg('Favor informar os campos obrigatórios!');
        }
        return isValid;
    }

    /**
     *
     * */
    private validarObjeto(text: string): boolean {
        if (text !== undefined && text !== null && text !== '') {
            return true;
        } else {
            document.getElementById('text').setAttribute('style', 'border-color: red;');
            return false;
        }
    }

    /**
     *
     * */
    private returnInputToNormalStyle() {
        document.getElementById('firstName').setAttribute('style', 'border-color: #bdbdbd;');
        document.getElementById('lastName').setAttribute('style', 'border-color: #bdbdbd;');
        document.getElementById('login').setAttribute('style', 'border-color: #bdbdbd;');
        document.getElementById('email').setAttribute('style', 'border-color: #bdbdbd;');
    }

    /**
     *
     * */
    private subscribeToSaveResponse(result: Observable<User>) {
        result.subscribe((res: User) => {
            this.isSaving = false;
            this.router.navigate(['/admin/user']);
            if (this.isEdit) {
                this.pageNotificationService.addUpdateMsg();
            }
            else {
                this.pageNotificationService.addCreateMsg();
            }

        }, (error: Response) => {
            this.isSaving = false;

            switch (error.status) {
                case 400: {
                    const EXISTING_USER = 'error.userexists';
                    const EXISTING_MAIL = 'error.emailexists';
                    const EXISTING_FULLNAME = 'error.fullnameexists';

                    if (error.headers.toJSON()['x-abacoapp-error'][0] === EXISTING_USER) {
                        this.pageNotificationService.addErrorMsg('Usuário já cadastrado!');
                        document.getElementById('login').setAttribute('style', 'border-color: red;');
                    } else {
                        if (error.headers.toJSON()['x-abacoapp-error'][0] === EXISTING_MAIL) {
                            this.pageNotificationService.addErrorMsg('E-mail já cadastrado!');
                            document.getElementById('email').setAttribute('style', 'border-color: red;');
                        } else {
                            if (error.headers.toJSON()['x-abacoapp-error'][0] === EXISTING_FULLNAME) {
                                this.pageNotificationService.addErrorMsg('Usuário já cadastrado!');
                                document.getElementById('firstName').setAttribute('style', 'border-color: red;');
                                document.getElementById('lastName').setAttribute('style', 'border-color: red;');
                            }
                        }
                        let invalidFieldNamesString = '';
                        const fieldErrors = JSON.parse(error['_body']).fieldErrors;
                        invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
                        this.pageNotificationService.addErrorMsg('Campos inválidos: ' + invalidFieldNamesString);
                    }
                }
            }
        });
    }

    /*
     * Função para recuperar dados do usuário logado para edição
     * */
    loadCurrentUser() {
        this.userService.findCurrentUser().subscribe((res: User) => {
            this.user = res;
            this.tipoEquipes = this.tipoEquipes.concat(res.tipoEquipes);
            this.populateUserAuthoritiesWithArtificialId();
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
        this.urlSub.unsubscribe();
    }

    /*
     * Função que seta a flag de administração para controle dos campos que serão apresentados quando da edição de usuário.
     * */
    private isUserAdmin(): boolean {
        return this.authService.isAuthenticated && this.authService.hasRole(ADMIN_ROLE);
    }

    desabilitado(): boolean {
        return !this.isAdmin;
    }

    disableEquipeDropdown() {
        if (this.user.organizacoes != null || this.user.organizacoes != undefined) {
            return this.user.organizacoes.length < 1;
        }
        return true;
    }

    /**
     * Método responsável por popular a equipe responsavel da organização
     */
    setEquipeOrganizacao(org: Organizacao[]) {
        this.tipoEquipes = [];
        org.forEach(element => {
            this.tipoEquipeService.findAllByOrganizacaoId(element.id).subscribe((res: ResponseWrapper) => {
                this.tipoEquipes = this.tipoEquipes.concat(res.json);
            });
        });
    }
}