import { Injectable } from "@angular/core";
import { ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend } from "@angular/http";
import { Observable } from "rxjs/Rx";
import { JwtHelper, AuthConfigConsts } from "angular2-jwt";
import { AuthConfig } from '@basis/angular-components';

import 'rxjs/add/observable/empty';

declare var window: any;

@Injectable()
export class AutenticacaoHttp extends Http {
    constructor(
        backend: ConnectionBackend, 
        defaultOptions: RequestOptions, 
        private jwtHelper: JwtHelper,
        private config: AuthConfig) {
        super(backend, defaultOptions);
    }

    private getCookie(nomeParametro: string): string {
        var nome = nomeParametro + "=";
        var cookie = document.cookie.split(';');
        for(var i = 0; i < cookie.length; i++) {
            var c = cookie[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(nome) == 0) {
                return c.substring(nome.length, c.length);
            }
        }
        return "";
    }

    public request(url: any, options?: RequestOptionsArgs): Observable<any | Response> {
        let token: string = this.getCookie("Authentication");
        if (url !== "/api/logout" && url.url !== "/api/authenticate" && token && this.jwtHelper.isTokenExpired(token)) {
            this.config.userStorage.removeItem(AuthConfigConsts.DEFAULT_TOKEN_NAME);
            this.config.userStorage.removeItem(this.config.userStorageIndex);
            document.cookie = "";
            window.location.href = this.config.logoutUrl;
            return Observable.empty<Response>();
        } else {
            return super.request(url, options);
        }
    }

}

export function autenticacaoHttpFactory(
    backend: XHRBackend, 
    defaultOptions: RequestOptions, 
    jwtHelper: JwtHelper,
    authConfig: AuthConfig) {
    return new AutenticacaoHttp(
        backend, 
        defaultOptions, 
        jwtHelper,
        authConfig);
}
