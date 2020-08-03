import { Component, OnInit, OnDestroy, NgZone} from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../user';
import { Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';
import { AuthenticationService } from '@nuvem/angular-base';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls:['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  username: string;
  password: string;

  authenticated = false;

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthenticationService<User>,
    private http: HttpClient,
    private zone: NgZone,
    private pageNotificationService: PageNotificationService,
  ) { }

  getLabel(label) {
    return label;
  }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
  }

  ngOnDestroy() {
  }

  login() {

    if (!this.username || !this.password) {
      this.pageNotificationService.addErrorMessage(this.getLabel('Por favor preencher os campos Obrigatórios!'));
      return;
    }

    if (this.password.length < 4) {
      this.pageNotificationService.addErrorMessage(this.getLabel('A senha precisa ter no mínimo 4 caracteres!'));
      return;
    }

    this.loginService.login(this.username, this.password).subscribe(() => {
      this.authService.login();

      // FIXME Bypassando o componente para funcionar com o firefox
      this.getUserDetails().subscribe(response => {
        const storageKey = environment.auth.userStorageIndex;
        environment.auth.userStorage[`${storageKey}`] = JSON.stringify(response);
        this.zone.runOutsideAngular(() => {
          location.reload();
        });
      });
    }, error => {
      switch (error.status) {
        case 401: {
          this.pageNotificationService.addErrorMessage(this.getLabel('Login.Mensagens.msgUsuarioOuSenhaInvalidos'));
        } break;
        case 400: {
          this.pageNotificationService.addErrorMessage(this.getLabel('Login.Mensagens.msgUsuarioOuSenhaInvalidos'));
        } break;
      }
    });
  }

  protected getUserDetails(): Observable<any> {
    return this.http.get<any>(`${environment.auth.detailsUrl}`);
  }

  authenticatedUserFullName(): string {
    const storageUser = this.authService.getUser();
    if (!storageUser) {
      return;
    }
    return storageUser.firstName + ' ' + storageUser.lastName;
    return ;
  }

  private sleepFor(sleepDuration) {
    const now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
  }

}
