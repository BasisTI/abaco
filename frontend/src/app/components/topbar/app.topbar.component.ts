import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AuthenticationService } from '@nuvem/angular-base';
import { User } from '../../user/user.model';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.css']
})

export class AppTopbarComponent {


    constructor(public app: AppComponent,

        private readonly _authentication:


        AuthenticationService<User>)    {
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
        const storageUser  = this._authentication.getUser();
        if (!storageUser) {
            return null;
        }

        return storageUser.firstName;
    }
}

