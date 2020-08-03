import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';

@Injectable()
export class UserGuard implements CanActivate {

  constructor(private authService: AuthGuard) { }

  canActivate() {
    // return this.authService.hasRole(ADMIN_ROLE);
    return true;
  }
}
