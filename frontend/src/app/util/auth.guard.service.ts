import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router,
        ){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const roleParaVerificar = route.data.roleParaVerificar;
        return this.authService.possuiRole(roleParaVerificar);
    }

}
