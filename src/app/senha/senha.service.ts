import { Injectable } from '@angular/core';
import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService, AuthService } from '@basis/angular-components';
import { User } from '../user';
import { environment } from '../../environments/environment';
import { ResponseWrapper } from '../shared';

@Injectable()
export class SenhaService {

    private changeUrl = environment.apiUrl + '/account/change_password';

    constructor(private http: HttpService, private authService: AuthService<User>) { }

    changePassword(newPassword: string): Observable<any> {
        return this.http.post(this.changeUrl, newPassword).map(
            (res: Response) => {
                return res;
            });
    }

    getLogin(): Observable<Response> {
        return this.http.get(`api/authenticate`);
      }
}
