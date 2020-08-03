import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpGenericErrorService } from '@nuvem/angular-base';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LoginService {

    private authUrl = environment.apiUrl + '/authenticate';

    private logoutUrl = environment.apiUrl + '/logout';

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<any> {
        const credential = { username: username, password: password };
        return this.http.post<any>(this.authUrl, credential);
    }

    logout(): Observable<any> {
        // this.cookieService.deleteAll();
        return this.http.get(this.logoutUrl);
    }
}
