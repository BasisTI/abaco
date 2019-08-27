import { TranslateService } from '@ngx-translate/core';
import { PageNotificationService } from '../shared/page-notification.service';
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { ErrorConstants } from '../shared/constants/errorConstants';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(
        private pageNotificationService: PageNotificationService,
        private translate: TranslateService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).catch(
            (error: HttpErrorResponse) => {
                if (error.status == 400 ) {
                    this.translateMessage(error.error.message);
                }
                return Observable.throw(error);
            }
        );
    }

    translateMessage(messageAddress: string) {
        this.translate.get(ErrorConstants[messageAddress]).subscribe((translateMessage: string) => {
            console.log(`menssagens: ${ErrorConstants[messageAddress]} ${translateMessage}`);
            this.pageNotificationService.addErrorMsg(translateMessage);
        } )
    }

}
