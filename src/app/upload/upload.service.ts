import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Upload } from './upload.model';
import { Observable } from 'rxjs';

@Injectable()
export class UploadService {

    constructor(private http: HttpClient) { }

    resources = {
        upload: environment.apiUrl + '/uploadFile',
        uploadLogo: environment.apiUrl + '/uploadLogo',
        getArquivoManual: environment.apiUrl + '/getFile',
        getFilesByManual: environment.apiUrl + '/manuals/arquivos',
        getFile: environment.apiUrl + '/getLogo',
        getFileInfo: environment.apiUrl + '/getLogo/info',
        saveFile: environment.apiUrl + '/saveFile'
    };

    uploadFile(files: File[]) {

        const headers: any = {
            'Content-Type': 'multipart/form-data',
        }
        let body = new FormData();

        for(let i = 0; i < files.length; i++){
            body.append('file', files[i]);
        }

        return this.http.post(this.resources.upload, body);
    }

    deleteFile(id: number, manualId) : Observable<void>{
        let params = new HttpParams();

        params = params.append('arquivoId', JSON.stringify(id));
        params = params.append('manualId', JSON.stringify(manualId));

        return this.http.delete<void>(environment.apiUrl + '/deleteFile/',  {params: params});
    }

    uploadLogo(file: File) {
        const headers: any = {
            'Content-Type': 'multipart/form-data',
        }
        let body = new FormData();
        body.append('file', file);
        return this.http.post(this.resources.uploadLogo, body);
    }


    saveFile(file: File): any {

        const headers: any = {
            'Content-Type': 'multipart/form-data',
        }

        let body = new FormData();

        body.append('file', file);

        return this.http.post(this.resources.saveFile, body);
    }

    convertJsonToObject(json: any): Upload {
        const upload = Object.create(Upload.prototype);
        return Object.assign(upload, json, {
            created: new Date(json.created)
        });
    }

    getFilesByManual(manualId: number): Observable<File[]>{
        return this.http.get<File[]>(this.resources.getFilesByManual+'/'+ manualId);
    }

    getFile(id: number) {
        return this.http.get<File>(this.resources.getArquivoManual + '/' + id);
    }

    getFileInfo(id: number) {
        return this.http.get(this.resources.getFileInfo + "/" + id);
    }


    getLogo(id: number) {
        return this.http.get<Upload>(this.resources.getFile + "/" + id);
    }

}
