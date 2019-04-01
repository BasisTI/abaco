import { Injectable } from '@angular/core';
import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService, AuthService } from '@basis/angular-components';
import { User } from '../user';
import { environment } from '../../environments/environment';
import { PageNotificationService, ResponseWrapper } from '../shared';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SenhaService {

    private changeUrl = environment.apiUrl + '/account/change_password';

    constructor(private http: HttpService, private authService: AuthService<User>,
        private pageNotificationService: PageNotificationService, private translate: TranslateService) { }

 
getLabel(label) {
    let str: any;
    this.translate.get(label).subscribe((res: string) => {
        str = res;
    }).unsubscribe();
    return str;
}

changePassword(newPassword: string): Observable < any > {
    return this.http.post(this.changeUrl, newPassword).map(
        (res: Response) => {
            return res;
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
                return Observable.throw(new Error(error.status));
            }
        });
}

getLogin(): Observable < Response > {
    return this.http.get(`api/authenticate`).catch((error: any) => {
        if (error.status === 403) {
            this.pageNotificationService.addErrorMsg(this.getLabel('Global.Mensagens.VoceNaoPossuiPermissao'));
            return Observable.throw(new Error(error.status));
        }
    });
}
}
