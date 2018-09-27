import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { HttpService } from '@basis/angular-components';
import { environment } from '../../environments/environment';
import { Upload } from './upload.model';

@Injectable()
export class UploadService {

  constructor(private http: HttpService) { }

  resources = {
    upload: environment.apiUrl + '/upload',
    getFile: environment.apiUrl + '/getFile',
    getFileInfo: environment.apiUrl + '/getFile/info',
    saveFile: environment.apiUrl + '/saveFile'
  };

  uploadFile(file: File) {
    console.log('Entrando depois do 7')
    const headers: any = {
      'Content-Type': 'multipart/form-data',
    }
    console.log('Headers',headers)
    console.log('passo 1')
    let body = new FormData();
    console.log('pBody:',body)


    body.append('file', file)

    return this.http.post(this.resources.upload, body).map(response => {
      console.log("Resultado ",response)
      return response.json();
    });
  }


  saveFile(file: File): any {

    const headers: any = {
      'Content-Type': 'multipart/form-data',
    }
  
    let body = new FormData();

    body.append('file', file)

    return this.http.post(this.resources.saveFile, body).map(response => {
      return this.convertJsonToObject(response.json());
    });
  }

  convertJsonToObject(json: any): Upload {
    const upload = Object.create(Upload.prototype);
    return Object.assign(upload, json, {
        created: new Date(json.created)
    });
}




  getFile(id: number) {
    return this.http.get(this.resources.getFile, {
      params: {
        id: id
      }
    }).map(response => {
      return response;
    });
  }

  getFileInfo(id: number) {
    return this.http.get(this.resources.getFileInfo+ "/" + id).map(response => {
      return response.json();
    });
  }

  
  getLogo(id: number) {
    return this.http.get(this.resources.getFileInfo+ "/" + id).map(response => {
      return response.json();
    });
  }

}
