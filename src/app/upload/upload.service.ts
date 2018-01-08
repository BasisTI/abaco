import { Injectable } from '@angular/core';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

@Injectable()
export class UploadService {

  constructor(private http: HttpService) { }

  resourceName = '/upload'
  resourceUrl = environment.apiUrl + this.resourceName ;

  uploadFile(file: File) {
    const headers: any = {
      'Content-Type': 'multipart/form-data'
    }
    const body: any = {
        file: file
    }

    return this.http.post(this.resourceUrl, body, {headers: headers});
  }

}
