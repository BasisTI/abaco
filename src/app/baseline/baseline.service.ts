import {Injectable} from '@angular/core';
import {HttpService} from '@basis/angular-components';
import {environment} from '../../environments/environment';


@Injectable()
export class BaselineService {

    resourceUrl = environment.apiUrl + '/baseline';


    constructor(private http: HttpService) {
    }

}
