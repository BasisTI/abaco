import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthGuard } from '@nuvem/angular-base';

@Injectable()
export class ObservadorGuard implements CanActivate {

  constructor(private authService: AuthGuard) { }

  canActivate() {
    // return this.authService.hasRole(ROLE_VIEW);
    return true;
  }
}
