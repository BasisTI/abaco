import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';
import { DatatableComponent, PageNotificationService } from '@nuvem/primeng-components';
import { ConfirmationService, SelectItem } from 'primeng';
import { Observable, Subscription } from 'rxjs';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { Perfil, PerfilService } from 'src/app/perfil';
import { PerfilOrganizacao } from 'src/app/perfil/perfil-organizacao.model';
import { TipoEquipe, TipoEquipeService } from 'src/app/tipo-equipe';
import { AuthService } from 'src/app/util/auth.service';
import { User } from '../user.model';
import { UserService } from '../user.service';



@Component({
    selector: 'jhi-user-form',
    templateUrl: './user-form.component.html',
    providers: [ConfirmationService],
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

    perfilNovo: Perfil;
    organizacoesSelecionada: Organizacao[];
    organizacoesOptions: SelectItem[];
    perfilOrganizacao: PerfilOrganizacao;
    perfilOrganizacaoEdit: PerfilOrganizacao = null;
    contagem: number = 0;

    @ViewChild(DatatableComponent) tables: DatatableComponent;


    mostrarDialogOrgPerfil: boolean;

    rowsPerPageOptions: number[] = [5, 10, 20, 100];

    dialogAlterarSenha: boolean = false;
    novaSenha: String = "";
    novaSenhaConfirm: String = "";

    canAlterarSenha: boolean = false;

    constructor(
        private confirmationService: ConfirmationService,
        private authService: AuthService,
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
        this.verificarPermissoes();
    }
    verificarPermissoes() {
        if (this.authService.possuiRole(AuthService.PREFIX_ROLE + "USUARIO_ALTERAR_SENHA") == true) {
            this.canAlterarSenha = true;
        }
    }

    private recuperarListaPerfis() {
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
                    if (this.user.perfilOrganizacoes) {
                        this.setEquipeOrganizacao(this.user.organizacoes);
                    } else {
                        this.user.perfils = [];
                        this.user.organizacoes = [];
                    }
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
        this.user.perfils = [];
        this.user.perfilOrganizacoes.forEach(item => {
            item.id = undefined;
            if (this.user.perfils.indexOf(item.perfil) === -1) {
                this.user.perfils.push(item.perfil);
            }
        })
        this.carregarOrganizacoes();
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

    abrirDialogOrgPerfil() {
        this.mostrarDialogOrgPerfil = true;
        this.perfilOrganizacao = new PerfilOrganizacao();
        this.organizacoesOptions = [];
        this.perfilNovo = null;
        if (this.carregarOrganizacoes().length > 0) {
            for (let index = 0; index < this.organizacoes.length; index++) {
                const organizacao = this.organizacoes[index];
                if (this.carregarOrganizacoes().findIndex(i => i.id === organizacao.id) < 0) {
                    this.organizacoesOptions.push({
                        value: organizacao,
                        label: organizacao.nome
                    });
                }
            }
        } else {
            for (let index = 0; index < this.organizacoes.length; index++) {
                const organizacao = this.organizacoes[index];
                this.organizacoesOptions.push({
                    value: organizacao,
                    label: organizacao.nome
                });
            }
        }
    }
    fecharDialogOrgPerfil() {
        this.mostrarDialogOrgPerfil = false;
        this.organizacoesSelecionada = [];
        this.perfilNovo = null;
        this.carregarOrganizacoes()
        this.setOrganizacao(this.user.organizacoes);

    }
    adicionarOrgPerfil() {
        if (this.organizacoesSelecionada.length > 0 && this.perfilNovo) {
            if (!this.user.perfils) {
                this.user.perfils = [];
            }
            if (!this.user.organizacoes) {
                this.user.organizacoes = [];
            }
            if (!this.user.perfilOrganizacoes) {
                this.user.perfilOrganizacoes = [];
            }
            this.organizacoesSelecionada.forEach(org => {
                this.perfilOrganizacao.organizacoes.push(org);
            });

            this.perfilOrganizacao.perfil = this.perfilNovo;

            this.perfilOrganizacao.id = this.contagem++;


            this.user.perfilOrganizacoes.push(this.perfilOrganizacao);
            this.fecharDialogOrgPerfil();

        }
        else {
            this.pageNotificationService.addErrorMessage("Selecione uma organização e um perfil para adicionar!")
        }
    }

    carregarOrganizacoes(): Organizacao[] {
        let organizacoes: Organizacao[] = [];
        this.user.organizacoes = [];
        if (this.user.perfilOrganizacoes) {
            this.user.perfilOrganizacoes.forEach(perfilOrganizacao => {
                perfilOrganizacao.organizacoes.forEach(organizacao => {
                    if (organizacoes.indexOf(organizacao) === -1) {
                        organizacoes.push(organizacao);
                        this.user.organizacoes.push(organizacao);
                    }
                })
            })
        }
        return organizacoes;
    }

    selectColumn() {
        this.tables.pDatatableComponent.metaKeySelection = true;
        if (this.tables && this.tables.selectedRow) {
            this.perfilOrganizacaoEdit = this.tables.selectedRow;
        }
    }
    datatableClickOrgPerfil(event) {
        if (!event.selection) {
            return;
        }
        switch (event.button) {
            case "delete":
                this.confirmDeletePerfilOrg();
                break;
            default:
                break;
        }
    }

    confirmDeletePerfilOrg() {
        if (this.perfilOrganizacaoEdit != null) {
            this.confirmationService.confirm({
                message: this.getLabel('Tem certeza que deseja excluir o registro?'),
                accept: () => {
                    this.user.perfilOrganizacoes.splice(this.user.perfilOrganizacoes.indexOf(this.perfilOrganizacaoEdit), 1);
                    this.carregarOrganizacoes();
                    this.setOrganizacao(this.user.organizacoes);
                    this.tables.refresh();
                    this.perfilOrganizacaoEdit = null;
                }
            })
        }
    }

    
    
    abrirDialogAlterarSenha(){
        this.dialogAlterarSenha = true;
    }
    fecharDialogAlterarSenha(){
        this.dialogAlterarSenha = false;
        this.novaSenha = "";
        this.novaSenhaConfirm = "";
    }

    alterarSenha(){
        if(this.novaSenha && this.novaSenhaConfirm){
            if(this.novaSenha.length >= 6 && this.novaSenhaConfirm.length >= 6){
                if(this.novaSenha === this.novaSenhaConfirm){
                    this.userService.alterarSenha(this.user.id, this.novaSenha).subscribe(r => {
                        this.pageNotificationService.addSuccessMessage("Senha alterada com sucesso!");
                        this.fecharDialogAlterarSenha();
                    });
                }else{
                    return this.pageNotificationService.addErrorMessage("As senhas não conferem, por favor revisar!");
                }
            }else{
                return this.pageNotificationService.addErrorMessage("Digite 6 dígitos ou mais!");
            }
        }else{
            return this.pageNotificationService.addErrorMessage("Digite os dois campos corretamente.");
        }
    }
}

