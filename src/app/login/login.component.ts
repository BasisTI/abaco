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

  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService<User>
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  login() {
    this.loginService.login(this.username, this.password).subscribe(() => {
      
    });
  }

}
