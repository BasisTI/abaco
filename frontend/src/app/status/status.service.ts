import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Status } from './status.model';


@Injectable()
export class StatusService {

    resourceUrl = environment.apiUrl + '/status';


    searchUrl = environment.apiUrl + '/_search/status';

    constructor(private http: HttpClient, private pageNotificationService: PageNotificationService) {
    }

    getLabel(label) {
        return label;
    }

    create(status: Status): Observable<Status> {
        const copy = this.convert(status);
        return this.http.post(this.resourceUrl, copy).pipe(
        catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    update(status: Status): Observable<Status> {
        const copy = this.convert(status);
        return this.http.put(this.resourceUrl, copy).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    find(id: number): Observable<Status> {
        return this.http.get(`${this.resourceUrl}/${id}`).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    dropDown(): Observable<Status[]> {
        return this.http.get<Status[]>(this.resourceUrl + '/drop-down').pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    list(): Observable<Status[]> {
        return this.http.get<Status[]>(this.resourceUrl + '/list').pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    listActive(): Observable<Status[]> {
        return this.http.get<Status[]>(this.resourceUrl + '/list-active').pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
    }



    delete(id: number): Observable<Response> {
        return this.http.delete<Response>(`${this.resourceUrl}/${id}`);
    }

    private convertResponse(res: any): Status[] {
        const result: Status[] = [];
        for (let i = 0; i < res.length; i++) {
            result.push(this.convertItemFromServer(res[i]));
        }
        return result;
    }

    private convertItemFromServer(json: any): Status {
        const entity: Status = Object.assign(new Status(), json);
        return entity;
    }

    private convert(status: Status): Status {
        const copy: Status = Object.assign({}, status);
        return copy;
    }
}
