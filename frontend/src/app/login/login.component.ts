import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User } from '../user';
import { Subscription, Observable } from 'rxjs';
import { AuthenticationService } from '@nuvem/angular-base';
import { HttpClient } from '@angular/common/http';
import { PageNotificationService } from '@nuvem/primeng-components';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
  }

  ngOnDestroy() {
  }

  login() {

    if (!this.username || !this.password) {
      this.pageNotificationService.addErrorMessage(this.getLabel('Por favor preencher campos obrigatórios'));
      return;
    }

    if (this.password.length < 4) {
      this.pageNotificationService.addErrorMessage(this.getLabel('A senha precisa ter no mínimo 4 caracteres!'));
      return;
    }

    this.loginService.login(this.username, this.password).subscribe(response => {
      this.authService.login();
      this.router.navigate(['/dashboard']);
    }, error => {
      switch (error.status) {
        case 401: {
          this.pageNotificationService.addErrorMessage(this.getLabel('Usuário ou senha inválidos!'));
        } break;
        case 400: {
          this.pageNotificationService.addErrorMessage(this.getLabel('Usuário ou senha inválidos!'));
        } break;
      }
    });
  }

  protected getUserDetails(): Observable<any> {
    return this.http.get(`${environment.auth.detailsUrl}`);
  }

  authenticatedUserFullName(): string {
    const storageUser = this.authService.getUser();
    if (!storageUser) {
      return;
    }
    return storageUser.firstName + ' ' + storageUser.lastName;
  }

}
