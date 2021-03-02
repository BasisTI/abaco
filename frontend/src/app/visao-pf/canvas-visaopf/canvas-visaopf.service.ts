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
}
