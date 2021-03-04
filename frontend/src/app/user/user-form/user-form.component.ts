import {Component, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { User } from '../user.model';
import { Subscription, Observable } from 'rxjs';
import { UserService } from '../user.service';
import { PageNotificationService } from '@nuvem/primeng-components';
import { AuthorizationService, Authorization, Authentication, AuthGuard } from '@nuvem/angular-base';
import { ResponseWrapper } from 'src/app/shared';
import { Perfil, PerfilService } from 'src/app/perfil';


@Component({
    selector: 'jhi-user-form',
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit, OnDestroy {

    tipoEquipes: TipoEquipe[];
    organizacoes: Organizacao[];
    perfils: Perfil[];
    user: User;
    isSaving: boolean;
    isEdit: boolean;
    isAdmin: boolean;
    private routeSub: Subscription;
    private urlSub: Subscription;
    private url: string;
    emaild: any;

    constructor(
        private authService: AuthGuard,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private tipoEquipeService: TipoEquipeService,
        private organizacaoService: OrganizacaoService,
        private pageNotificationService: PageNotificationService,
        private perfilService: PerfilService
    ) {
        this.isAdmin = this.isUserAdmin();
        this.recuperarUrl();
        if (this.url === 'usuario,edit') {
            this.loadCurrentUser();
            this.isEdit = true;
        }
    }
    getLabel(label) {
        return label;
    }
    ngOnInit() {
        this.isSaving = false;
        this.recuperarListaOrganizacao();
        this.recuperarListaPerfis();
        this.recuperarUsuarioPeloId();
    }

    private recuperarListaPerfis(){
        this.perfilService.getAllPerfisAtivo().subscribe((response) => {
            this.perfils = response;
        })
    }

    private recuperarListaOrganizacao() {
        this.organizacaoService.dropDownActive().subscribe((res) => {
            this.organizacoes = res;
        });
    }
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
                });
            }
        });
    }

    save(form) {
        if (!form.controls.email.valid && this.user.email) {
            this.pageNotificationService.addErrorMessage('E-mail Inválido');
            return;
        }

        if (!form.valid) {
            this.pageNotificationService.addErrorMessage('Por favor preencher os campos Obrigatórios!');
            return;
        }

        if (this.user.id !== undefined) {
            this.isEdit = true;
            this.subscribeToSaveResponse(this.userService.update(this.user));
        } else {
            this.subscribeToSaveResponse(this.userService.create(this.user));
        }
    }
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
            this.pageNotificationService.addErrorMessage('Por favor preencher os campos Obrigatórios!');
        }
        return isValid;
    }
    private validarObjeto(text: string): boolean {
        if (text !== undefined && text !== null && text !== '') {
            return true;
        } else {
            document.getElementById('text').setAttribute('style', 'border-color: red;');
            return false;
        }
    }
    private returnInputToNormalStyle() {
        document.getElementById('firstName').setAttribute('style', 'border-color: #bdbdbd;');
        document.getElementById('lastName').setAttribute('style', 'border-color: #bdbdbd;');
        document.getElementById('login').setAttribute('style', 'border-color: #bdbdbd;');
        document.getElementById('email').setAttribute('style', 'border-color: #bdbdbd;');
    }
    private subscribeToSaveResponse(result: Observable<User>) {
        result.subscribe((res: User) => {
            this.isSaving = false;
            this.router.navigate(['/admin/user']);
            if (this.isEdit) {
                this.pageNotificationService.addUpdateMsg();
            } else {
                this.pageNotificationService.addCreateMsg();
            }

        }, (error: Response) => {
            this.isSaving = false;
            switch (error.status) {
                case 400: {
                    const EXISTING_USER = 'error.userexists';
                    const EXISTING_MAIL = 'error.emailexists';
                    const EXISTING_FULLNAME = 'error.fullnameexists';

                    if (error.headers['x-abacoapp-error'][0] === EXISTING_USER) {
                        this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.Usuarios.Mensagens.UsuarioJaCadastrado'));
                        document.getElementById('login').setAttribute('style', 'border-color: red;');
                    } else {
                        if (error.headers['x-abacoapp-error'][0] === EXISTING_MAIL) {
                            this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.Usuarios.Mensagens.EmailJaCadastrado'));
                            document.getElementById('email').setAttribute('style', 'border-color: red;');
                        } else {
                            if (error.headers['x-abacoapp-error'][0] === EXISTING_FULLNAME) {
                                this.pageNotificationService.addErrorMessage(this.getLabel('Cadastros.Usuarios.Mensagens.UsuarioJaCadastrado'));
                                document.getElementById('firstName').setAttribute('style', 'border-color: red;');
                                document.getElementById('lastName').setAttribute('style', 'border-color: red;');
                            }
                        }
                        let invalidFieldNamesString = '';
                        const fieldErrors = JSON.parse(error['_body']).fieldErrors;
                        // invalidFieldNamesString = this.pageNotificationService.getInvalidFields(fieldErrors);
                        this.pageNotificationService.addErrorMessage(
                            this.getLabel('Cadastros.Usuarios.Mensagens.msgCamposInvalidos') + invalidFieldNamesString
                        );
                    }
                }
            }
        });
    }
    loadCurrentUser() {
        this.userService.findCurrentUser().subscribe((res: User) => {
            this.user = res;
            this.setEquipeOrganizacao(this.user.organizacoes);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
        this.urlSub.unsubscribe();
    }
    private isUserAdmin(): boolean {
        // return this.authService.canActivate && this.authService.canActivateChild(ADMIN_ROLE);
        return true;
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
    setOrganizacao(org: Organizacao[]) {
        this.user.tipoEquipes = [];
        this.setEquipeOrganizacao(org);
    }
    setEquipeOrganizacao(org: Organizacao[]) {
        this.tipoEquipes = [];
        if (org) {
            org.forEach(element => {
                this.tipoEquipeService.findAllByOrganizacaoId(element.id).subscribe((res) => {
                    this.tipoEquipes = this.tipoEquipes.concat(this.TipoEquipeSemRepeticao(res));
                });
            });
        }
    }
    private TipoEquipeSemRepeticao(listaTipoEquipe: TipoEquipe[]): TipoEquipe[] {
        return listaTipoEquipe.filter(tipoEquipeComparacao => {
            for (const tipoEquipe of this.tipoEquipes) {
                if (tipoEquipe.id === tipoEquipeComparacao.id) {
                    return false;
                }
            }
            return true;
        });
    }
}
