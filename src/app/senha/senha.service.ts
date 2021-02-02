import { Injectable, ɵɵresolveBody } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '@nuvem/angular-base';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeyPassword } from './senha-rec/key-password.model';
import { Router } from '@angular/router';

@Injectable()
export class SenhaService {

    private changeUrl = environment.apiUrl + '/account/change_password';
    private passwordResetUrl = environment.apiUrl + '/account/reset_password/init';
    private finishPasswordResetUrl = environment.apiUrl + '/account/reset_password/finish';



    constructor(private http: HttpClient, private authService: AuthorizationService,
        private pageNotificationService: PageNotificationService,
        private router: Router) { }


    getLabel(label) {
        return label;
    }

    changePassword(newPassword: string): Observable<any> {
        return this.http.post(this.changeUrl, newPassword).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    passwordReset(email: string = "", login: string = ""): Observable<any> {
        let body = new FormData();

        body.append("mail", email);
        body.append("login", login);

        return this.http.post(this.passwordResetUrl, body, { responseType: "text" })
            .pipe(catchError((error: any) => {
                if (error.status === 400) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('E-mail ou usuário inválido!'));
                    return Observable.throw(new Error(error.status));
                }
                if (error.status === 406) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Digite um e-mail!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    finishPasswordReset(keyPassword: KeyPassword): Observable<any> {
        return this.http.post(this.finishPasswordResetUrl, keyPassword);
    }

    getLogin(): Observable<any> {
        return this.http.request('GET', 'api/authenticate', { responseType: 'text' }).pipe(catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

}
