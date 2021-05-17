import { Injectable } from '@angular/core'
import {Observable} from 'rxjs'
import {HttpClient, HttpParams} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class VisaoPfExportModelService {

    constructor(private http: HttpClient) {
    }

    sendExportModel(model){
        let formData: FormData = new FormData()
        formData.append('uuid', model.uuid )
        formData.append('bucketModel', model.bucket )
        return this.http.post('/tfserver/deploymodel', formData, {responseType: 'text'})
    }

    getAllModels(){
        return this.http.get(`/visaopf/all/models/`)
    }

    updateModelPredict(modelName){
        let formData: FormData = new FormData()
        formData.append('modelName', modelName )
        return this.http.put('/visaopf/update/modelpredict', formData, {responseType: 'text'})
    }
}
