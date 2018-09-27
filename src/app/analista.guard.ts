import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@basis/angular-components';
import { User } from './user';
import {ADMIN_ROLE, ROLE_USER} from './shared/constants';

@Injectable()
export class AnalistaGuard implements CanActivate {

  constructor(private authService: AuthService<User>) { }

  canActivate() {
    return this.authService.hasRole(ROLE_USER);
  }
}
