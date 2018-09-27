import { Component, OnInit, OnDestroy, NgZone, OnChanges } from '@angular/core';
import { Response } from '@angular/http';
import { SenhaService } from './senha.service';
import { LoginService } from '../login';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { AuthService, HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';
import { User } from '../user';
import { PageNotificationService } from '../shared/page-notification.service';

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
    private pageNotificationService: PageNotificationService
  ) { }

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
          const msg = 'Senha alterada com sucesso para o usuário ' + this.login + '!';
          this.pageNotificationService.addSuccessMsg(msg);
          console.log(msg);
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
    }
    else {
      this.verificaErro('error.passwdNotEqual');
    }
  }

  private verificaErro(tipoErro: string) {
    let msgErro: string;

    console.log(`Erro encontrado: ${tipoErro}`);
    switch (tipoErro) {
      case 'error.passwdNotEqual': {
        msgErro = 'Senha nova senha não confere com a confirmação!';
      } break;
      case 'error.passwdMismatch': {
        msgErro = 'Senha atual incorreta!';
      } break;
      case 'error.badPasswdLimits': {
        msgErro = 'Nova senha é mujito pequena ou muito grande!';
      } break;
      default: {
        msgErro = 'Entrei no default.\nAlgo ainda está errado...';
      }
    }
    this.pageNotificationService.addErrorMsg(msgErro);

  }

  protected getUserDetails(): Observable<any> {
    return this.http.get(`${environment.auth.detailsUrl}`).map((response: Response) => {
      return response.json();
    });
  }

  authenticatedUserFullName(): string {
    const storageUser = this.authService.getUser();
    if (!storageUser) {
      return;
    }
    return storageUser.firstName + ' ' + storageUser.lastName;
  }

  private sleepFor(sleepDuration) {
    const now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
  }

}
