import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "@nuvem/angular-base";
import { PageNotificationService } from "@nuvem/primeng-components";
import { environment } from "src/environments/environment";
import { Perfil } from "../perfil";
import { User } from "../user/user.model";


@Injectable()
export class AuthService {

    public static PREFIX_ROLE = "ROLE_ABACO_";

    constructor(private authService: AuthenticationService<User>,
        private pageNotificationService: PageNotificationService,
        private http: HttpClient) {

    }

    possuiRole(role: string): boolean {
        for (let permissao of this.authService.getUser().roles) {
            if (role === permissao) {
                return true;
            }
        }
        this.pageNotificationService.addErrorMessage("Você não tem autorização para essa ação.");
        return false;
    }

}
