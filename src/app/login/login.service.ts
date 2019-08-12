import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LoginService {

    private authUrl = environment.apiUrl + '/authenticate';

    private logoutUrl = environment.apiUrl + '/logout';

    constructor(private http: HttpService, private cookieService: CookieService) { }

    login(username: string, password: string): Observable<any> {
        const credential = { username: username, password: password };
        return this.http.post(this.authUrl, credential).map(
            (res: Response) => {
                return res.json();
            });
    }

    logout(): Observable<any> {
        this.cookieService.deleteAll();
        return this.http.get(this.logoutUrl);
    }
}
