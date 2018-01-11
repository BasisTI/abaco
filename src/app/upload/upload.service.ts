import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';

@Injectable()
export class UploadService {

  constructor(private http: HttpService) { }

  resourceName = '/upload'
  resourceUrl = environment.apiUrl + this.resourceName ;

  uploadFile(file: File) {
    const headers: any = {
      'Content-Type': 'multipart/form-data',
    }

    let body = new FormData();

    body.append('file', file)

    return this.http.post(this.resourceUrl, body).map(response => {
      return response;
    });
    // return this.http.request(this.resourceUrl, {
    //   headers: headers,
    //   method: 'POST',
    //   body: body
    // }).map(response => {
    //   return response;
    // }, error => {
    //   console.log(error);
    // });
  }

}
