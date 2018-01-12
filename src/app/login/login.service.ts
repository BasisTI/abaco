import { Injectable } from '@angular/core';
import { RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

@Injectable()
export class LoginService {

    resourceUrl = environment.apiUrl + '/authenticate';

    constructor(private http: HttpService) { }

    login(username: string, password: string): Observable<any> {
        const credential = { username: username, password: password };
        return this.http.post(this.resourceUrl, credential).map(
            (res: Response) => {
                return res.json();
            });
    }
}
