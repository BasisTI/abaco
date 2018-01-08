import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
// import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

@Injectable()
export class UploadService {

  constructor(private http: HttpClient) { }

  resourceName = '/upload'
  resourceUrl = environment.apiUrl + this.resourceName ;

  uploadFile(file: File) {
    const headers: any = {
      'Content-Type': 'multipart/form-data',
    }

    let formdata: FormData = new FormData();

    formdata.append('file', file);

    const req = new HttpRequest('POST', '/post', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

}
