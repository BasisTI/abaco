import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AuthenticationService } from '@nuvem/angular-base';
import { User } from '../../user/user.model';
import { LoginService } from 'src/app/login';
import { PageNotificationService } from '@nuvem/primeng-components';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.css']
})

export class AppTopbarComponent {


    constructor(public app: AppComponent,
        private loginService: LoginService,
        private pageNotificationService: PageNotificationService,
        private readonly _authentication:


            AuthenticationService<User>) {
    }

    get usuario() {
        return this._authentication.getUser();
    }

    isAuthenticated() {
        return this._authentication.isAuthenticated();
    }
    AuthenticationService() {
        return this._authentication.isAuthenticated();
    }
    authenticatedUserFirstName(): string {
        const storageUser = this._authentication.getUser();
        if (!storageUser) {
            return null;
        }

        return storageUser.firstName;
    }

    sair() {
        this.pageNotificationService.addInfoMessage("Saindo da conta...");
        this.loginService.logout().subscribe(() => {});
    }
}

