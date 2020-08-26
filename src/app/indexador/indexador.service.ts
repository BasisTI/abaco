import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/';
import { finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BlockUiService } from '@nuvem/angular-base';

@Injectable()
export class IndexadorService {

    resourceUrl = environment.apiUrl + '/indexador/index';
    urlIndexarObject = environment.apiUrl + '/reindexar';
    urlListIndex = environment.apiUrl + '/listar-indexadores';


    constructor(private http: HttpClient, private router: Router, private blockUiService: BlockUiService ) {
    }

    reindexar(lstIndexadores: String[]): Observable<any> {
        this.blockUiService.show();
        const url = this.urlIndexarObject + '?lstIndexadores=' + lstIndexadores.toString();
        return this.http.get(url).pipe(
            finalize(
                () => {
                    this.blockUiService.hide();
                    this.router.navigate(['/dashboard']);
            })
        );
    }

}
