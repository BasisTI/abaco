import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Response } from '@angular/http';
import { SenhaService } from './senha.service';
import { LoginService } from '../login';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { AuthService, HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';
import { User } from '../user';
import { PageNotificationService } from '../shared/page-notification.service';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.component.html',
})
export class SenhaComponent implements OnInit, OnDestroy {

  private oldPassword: string;
  private newPassword: string;
  private newPasswordConfirm: string;

  authenticated = false;

  private routeSub: Subscription;
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
  ) {
    this.getLogin().subscribe((res: string) => {
      this.login = res;
    });
    console.log(`Construtor() - Usuário: ${this.login}`);
  }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
    console.log(`ngOnInit() - Usuário: ${this.login}`);
  }

  ngOnDestroy() {
  }

  senha() {
    console.log(`senha() - Usuário: ${this.login}`);
    this.loginService.login(this.login, this.oldPassword).subscribe(() => {
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
          this.pageNotificationService.addErrorMsg('Usuário ou senha inválidos!');
        } break;
      }
    });
    console.log(`senha() - senha: ${this.oldPassword}`);
    /*this.senhaService.changePassword(this.newPassword).subscribe(() => {
    });*/
  }

  getLogin(): Observable<any> {
    return this.http.get(`api/authenticate`).map((response: Response) => {
      return response.json();
    });
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
