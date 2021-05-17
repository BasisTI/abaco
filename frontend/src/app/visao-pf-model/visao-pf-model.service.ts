import { Injectable } from '@angular/core'
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class VisaoPfModelService {

  constructor(private http: HttpClient) {
  }

  getDatasetMetrica(){
    return this.http.get("/visaopf/get/dataset/metricas/totrain/")
  }

  startTrain(){
    var trainSteps = '500'
    let formData: FormData = new FormData()
    formData.append('trainSteps', trainSteps )
    return this.http.post('/visaopf/train/', formData, {responseType: 'text'})
  }

  getProcessoTreinamento(uuid:string){
    return this.http.get(`/visaopf/processo/treinamento/${uuid}`)
  }

  getModelTreinado(id:string){
    return this.http.get(`/visaopf/model/${id}`)
  }

  getModelTreinadoByUUID(uuid:string){
    return this.http.get(`/visaopf/model/byuuid/${uuid}`)
  }

  getDatasetByUUID(uuid:string){
    return this.http.get(`/visaopf/get/dataset/metricas/${uuid}/`)
  }
}
