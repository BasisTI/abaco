import { Injectable } from '@angular/core';
import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

@Injectable()
export class LoginService {

    private authUrl = environment.apiUrl + '/authenticate';

    private logoutUrl = environment.apiUrl + '/logout';

    constructor(private http: HttpService) { }

    login(username: string, password: string): Observable<any> {
        const credential = { username: username, password: password };
        return this.http.post(this.authUrl, credential).map(
            (res: Response) => {
                return res.json();
            });
    }

    logout(): Observable<any> {
        return this.http.get(this.logoutUrl);
    }
}
