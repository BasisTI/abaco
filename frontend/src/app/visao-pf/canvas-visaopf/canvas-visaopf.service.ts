import { Injectable } from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  constructor(private http: HttpClient) {
  }

  setComponenteTela(telaId:string, component:any){
    return this.http.put(`visaopf/tela/${telaId}/componente`, component)
  }

  updateComponent(component:any){
    return this.http.put('visaopf/componente', component, {responseType: 'text'})
  }

  deleteComponent(telaId:any, componentId:any){
    return this.http.delete(`visaopf/tela/${telaId}/component/${componentId}`)
  }

  sendOCR(coordenada:any, bucketName, fileName){
    let formData: FormData = new FormData()
    formData.append('coordenada', JSON.stringify(coordenada))
    formData.append('bucketName', bucketName)
    formData.append('fileName', fileName)
    return this.http.post('/visaopf/component/ocr', formData, {responseType: 'text'})
  }

  getProcessoOCR(id){
    return this.http.get(`/visaopf/processo/ocr/${id}`)
  }
}
