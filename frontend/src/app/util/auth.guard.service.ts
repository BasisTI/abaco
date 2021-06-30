import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        let authenticated = this.authService.isAuthenticated();
        if (!authenticated) {
            return this.router.navigate(["/login"]);
        }

        let can: boolean = true;
        const roleParaVerificar: string[] = route.data.roleParaVerificar;
        if (roleParaVerificar) {
            can = false;

            roleParaVerificar.forEach(role => {
                if (this.authService.possuiRole(role)) {
                    can = true;
                }
            })
        }

        return can;
    }

}
