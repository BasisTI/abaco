import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {Response} from '@angular/http';
import {SenhaService} from './senha.service';
import {LoginService} from '../login';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import {AuthService, HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {User} from '../user';
import {PageNotificationService} from '../shared/page-notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-form-senha',
    templateUrl: './senha.form-component.html',
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
        private authService: AuthService<User>,
        private loginService: LoginService,
        private http: HttpService,
        private zone: NgZone,
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {
    }

    getLabel(label) {
        let str: any;
        this.translate.get(label).subscribe((res: string) => {
            str = res;
        }).unsubscribe();
        return str;
    }

    ngOnInit() {
        this.authenticated = this.authService.isAuthenticated();
        this.recuperarLogin();
    }

    ngOnDestroy() {
    }

    private recuperarLogin() {
        this.urlSub = this.route.params.subscribe(params => {
            if (params['login']) {
                this.login = params['login'];
            }
        });
    }


    senha() {
        if (this.newPassword === this.newPasswordConfirm) {
            this.loginService.login(this.login, this.oldPassword).subscribe(() => {
                this.senhaService.changePassword(this.newPassword).subscribe(() => {
                    const msg = this.getLabel('Configuracao.AlterarSenha.Mensagens.msgSenhaAlteradaComSucessoParaUsuario') + this.login + '!';
                    this.pageNotificationService.addSuccessMsg(msg);
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
        } else {
            this.verificaErro('error.passwdNotEqual');
        }
    }

    private verificaErro(tipoErro: string) {
        let msgErro: string;

        switch (tipoErro) {
            case 'error.passwdNotEqual': {
                msgErro = this.getLabel('Configuracao.AlterarSenha.Mensagens.msgNovaSenhaNaoConfereComConfirmacao');
            }
                break;
            case 'error.passwdMismatch': {
                msgErro = this.getLabel('Configuracao.AlterarSenha.Mensagens.msgSenhaAtualIncorreta');
            }
                break;
            case 'error.badPasswdLimits': {
                msgErro = this.getLabel('Configuracao.AlterarSenha.Mensagens.msgNovaSenhaMuitoPequenaOuMuitoGrande');
            }
                break;
            default: {
                msgErro = this.getLabel('Configuracao.AlterarSenha.Mensagens.msgEntreiNoDefaultAlgoEstaErrado');
            }
        }
        this.pageNotificationService.addErrorMsg(msgErro);

    }

}
