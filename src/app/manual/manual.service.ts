import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';
import {UploadService} from '../upload/upload.service';

import {Manual} from './manual.model';
import {ResponseWrapper, createRequestOption, JSONable, PageNotificationService} from '../shared';

@Injectable()
export class ManualService {

    resourceName = '/manuals';
    resourceUrl = environment.apiUrl + this.resourceName;
    searchUrl = environment.apiUrl + '/_search/manuals';

    constructor(
        private http: HttpService,
        private uploadService: UploadService,
        private pageNotificationService: PageNotificationService
    ) {
    }

    create(manual: Manual): Observable<any> {
        const copy = this.convert(manual);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
            if (error.status === 400) {
                this.pageNotificationService.addErrorMsg(`O nome digitado já existe!`);
                return Observable.throw(new Error(error.status));
            }
        });
    }

    update(manual: Manual): Observable<Manual> {
        const copy = this.convert(manual);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
        });
    }

    find(id: number): Observable<Manual> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        }).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res)).catch((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                    return Observable.throw(new Error(error.status));
                }
            });
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`).catch((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMsg('Você não possui permissão!');
                return Observable.throw(new Error(error.status));
            }
        });
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Manual.
     */
    private convertItemFromServer(json: any): Manual {
        const entity: JSONable<Manual> = new Manual();
        return entity.copyFromJSON(json);
    }

    /**
     * Convert a Manual to a JSON which can be sent to the server.
     */
    private convert(manual: Manual): Manual {
        const copy: Manual = manual.toJSONState();
        return copy;
    }
}
