import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";


@Injectable()
export class FirstGuardService implements CanActivate {

    constructor(private authService: AuthService,
        private router: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

        this.authService.getRoles().subscribe(r => {});

        let authenticated = this.authService.isAuthenticated();
        if (!authenticated) {
            return this.router.navigate(["/login"]);
        }
        return true;
    }

}
