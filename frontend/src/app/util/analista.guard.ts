import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';

@Injectable()
export class AnalistaGuard implements CanActivate {

  constructor() { }

  canActivate() {
    // return this.authService.hasRole(ROLE_USER);
    return true;
  }
}
