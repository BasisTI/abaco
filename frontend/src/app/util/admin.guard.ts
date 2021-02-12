import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from '../user';
import { AuthGuard } from '@nuvem/angular-base';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthGuard) { }

  canActivate() {
    // return this.authService.hasRole(ADMIN_ROLE);
    return true;
  }
}
