import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {

    private authUrl = environment.apiUrl + '/authenticate';

    private logoutUrl = environment.apiUrl + '/logout';

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        const credential = { username: username, password: password };
        return this.http.post(this.authUrl, credential);
    }

    logout(): Observable<any> {
        // this.cookieService.deleteAll();
        return this.http.get(this.logoutUrl);
    }
}
