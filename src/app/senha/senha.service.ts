import { Injectable } from '@angular/core';
import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

@Injectable()
export class SenhaService {

    private changeUrl = '/account/change_password';

    constructor(private http: HttpService) { }

    changePassword(newPassword: string): Observable<any> {
        // const credential = { username: username, password: password };
        return this.http.post(this.changeUrl, newPassword).map(
            (res: Response) => {
                return res.json();
            });
    }
}
