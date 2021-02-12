import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageNotificationService } from '@nuvem/primeng-components';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Nomenclatura } from './nomenclatura.model';

@Injectable()
export class NomenclaturaService {

    resourceUrl = environment.apiUrl + '/nomenclatura';
    searchUrl = environment.apiUrl + '/_search/nomenclatura';

    constructor(private http: HttpClient, private pageNotificationService: PageNotificationService) {
    }

    getLabel(label) {
        return label;
    }

    create(nomenclatura: Nomenclatura): Observable<Nomenclatura> {
        const copy = this.convert(nomenclatura);
        return this.http.post(this.resourceUrl, copy).pipe(
        catchError((error: any) => {
            if (error.status === 403) {
                this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                return Observable.throw(new Error(error.status));
            }
        }));
    }

    update(nomenclatura: Nomenclatura): Observable<Nomenclatura> {
      const copy = this.convert(nomenclatura);
      return this.http.put(this.resourceUrl, copy).pipe(
          catchError((error: any) => {
              if (error.status === 403) {
                  this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                  return Observable.throw(new Error(error.status));
              }
        }));
    }

    find(id: number): Observable<Nomenclatura> {
        return this.http.get(`${this.resourceUrl}/${id}`).pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    dropDown(): Observable<Nomenclatura[]> {
        return this.http.get<Nomenclatura[]>(this.resourceUrl + '/drop-down').pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
        }

    list(): Observable<Nomenclatura[]> {
        return this.http.get<Nomenclatura[]>(this.resourceUrl + '/list').pipe(
            catchError((error: any) => {
                if (error.status === 403) {
                    this.pageNotificationService.addErrorMessage(this.getLabel('Você não possui permissão!'));
                    return Observable.throw(new Error(error.status));
                }
            }));
    }

    listActive(): Observable<Nomenclatura[]> {
        return this.http.get<Nomenclatura[]>(this.resourceUrl + '/list-active').pipe(
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

    private convertResponse(res: any): Nomenclatura[] {
        const result: Nomenclatura[] = [];
        for (let i = 0; i < res.length; i++) {
            result.push(this.convertItemFromServer(res[i]));
        }
        return result;
    }

    private convertItemFromServer(json: any): Nomenclatura {
        const entity: Nomenclatura = Object.assign(new Nomenclatura(), json);
        return entity;
    }

    private convert(nomenclatura: Nomenclatura): Nomenclatura {
        const copy: Nomenclatura = Object.assign({}, nomenclatura);
        return copy;
    }
}
