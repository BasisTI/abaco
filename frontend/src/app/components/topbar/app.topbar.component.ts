import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { AuthenticationService } from '@nuvem/angular-base';
import { User } from '../../user/user.model';
import { LoginService } from 'src/app/login';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Organizacao, OrganizacaoService } from 'src/app/organizacao';
import { UploadService } from 'src/app/upload/upload.service';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.css']
})

export class AppTopbarComponent implements OnInit{


    organizacao: Organizacao = new Organizacao();
    src: String = "";

    constructor(public app: AppComponent,
        private orgService: OrganizacaoService,
        private uploadService: UploadService,
        private readonly _authentication:AuthenticationService<User>) {
    }

    ngOnInit(): void {
        this.orgService.searchActiveOrganizations().subscribe(r => {
            if(r.length === 1){
                let logo;
                if (r[0].logoId !== undefined && r[0].logoId != null) {
                    this.uploadService.getLogo(r[0].logoId).subscribe(response => {
                        logo = response.logo;
                        this.src = "data:image/png;base64,"+logo;
                    });
                }
            }       
        })
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

}

