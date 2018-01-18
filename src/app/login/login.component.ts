import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs/Rx';
import { AuthService } from '@basis/angular-components';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
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
    private authService: AuthService<User>
  ) { }

  ngOnInit() {
    this.authenticated = this.authService.isAuthenticated();
  }

  ngOnDestroy() {
  }

  login() {
    this.loginService.login(this.username, this.password).subscribe(() => {
      this.authService.loginSuccess();
      // FIXME workaround para o caso de a resposta da requisição para user details
      // não ter chegado ainda. Sugerir alteração no componente
      this.sleepFor(1000);
      window.location.href = '/';
    });
  }

  authenticatedUserFullName(): string {
    const storageUser = this.authService.getUser();
    return storageUser.firstName + ' ' + storageUser.lastName;
  }

  private sleepFor(sleepDuration) {
    const now = new Date().getTime();
    while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
  }

}
