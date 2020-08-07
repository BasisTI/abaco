import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationService, AuthenticationService, User } from '@nuvem/angular-base';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Subscription } from 'rxjs';
import { LoginService } from '../login';
import { SenhaService } from './senha.service';

@Component({
    selector: 'app-form-senha',
    templateUrl: './senha.form-component.html',
    providers:[LoginService]
})
export class SenhaFormComponent implements OnInit, OnDestroy {

    private oldPassword: string;
    private newPassword: string;
    private newPasswordConfirm: string;
    private url: string;

    authenticated = false;

    private routeSub: Subscription;
    private urlSub: Subscription;
    private login: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private senhaService: SenhaService,
        private authService: AuthenticationService<User>,
        private loginService: LoginService,
        private http: HttpClient,
        private zone: NgZone,
        private pageNotificationService: PageNotificationService,
    ) {
    }

    getLabel(label) {
        return label;
    }

    ngOnInit() {
        this.authenticated = this.authService.isAuthenticated();
    }

    ngOnDestroy() {
    }

    senha() {
        if (this.newPassword === this.newPasswordConfirm) {
            this.senhaService.getLogin().subscribe(response => {
                this.login = response;
                this.loginService.login(this.login, this.oldPassword).subscribe(() => {
                    this.senhaService.changePassword(this.newPassword).subscribe(() => {
                        const msg = this.getLabel('msgSenhaAlteradaComSucessoParaUsuario') + this.login + '!';
                        this.pageNotificationService.addSuccessMessage(msg);
                        this.router.navigate(['/']);
                    }, error => {
                        if (error.status === 400) {
                            this.verificaErro(error.headers.toJSON()['x-abacoapp-error'][0]);
                        }
                    });
                }, error => {
                    if (error.status === 401) {
                        this.verificaErro('error.passwdMismatch');
                    }
                });
            });
        } else {
            this.verificaErro('error.passwdNotEqual');
        }
    }

    private verificaErro(tipoErro: string) {
        let msgErro: string;

        switch (tipoErro) {
            case 'error.passwdNotEqual': {
                msgErro = this.getLabel('Nova senha não confere com a confirmação!');
            }
                break;
            case 'error.passwdMismatch': {
                msgErro = this.getLabel('Senha atual incorreta!');
            }
                break;
            case 'error.badPasswdLimits': {
                msgErro = this.getLabel('Nova senha é muito pequena ou muito grande!');
            }
                break;
            default: {
                msgErro = this.getLabel('Configuracao.AlterarSenha.Mensagens.msgEntreiNoDefaultAlgoEstaErrado');
            }
        }
        this.pageNotificationService.addErrorMessage(msgErro);

    }

}
