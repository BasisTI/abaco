import { Injectable } from '@angular/core'
import {Observable} from 'rxjs'
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class VisaoPfService {

  constructor(private http: HttpClient) {
  }

  updateComponent(component:any){
    return this.http.put('/visaopf/api/componente', component, {responseType: 'text'})
  }

  getListAnalises(){
    return this.http.get("/visaopf/api/analise")
  }

  getCenario(id:string){
    return this.http.get(`/visaopf/api/cenario/${id}`)
  }

  getAnalise(id:string){
    return this.http.get(`/visaopf/api/analise/${id}`)
  }

  getProcessoContagem(uuid:string){
    return this.http.get(`/visaopf/api/processo/${uuid}`)
  }

  getProcessoContagemByCenario(cenarioId:string){
    return this.http.get(`/visaopf/api/processo/cenario/${cenarioId}`)
  }

  getTela(id:string){
    return this.http.get(`/visaopf/api/tela/${id}`)
  }

  getComponent(id:string){
    return this.http.get(`/visaopf/api/componente/${id}`)
  }

  getTiposComponent(){
    return this.http.get("/visaopf/api/componente/tipos")
  }

  getTelaByUuid(uuid:string){
    return this.http.get(`/visaopf/api/tela/uuid/${uuid}`)
  }

  sendComponentDetection(visaopf: any): Observable<any> {
    let formData: FormData = new FormData()

    for(const tela of visaopf.cenario.telas){
        formData.append('telas', tela.imagem, tela.originalImageName )
    }

    return this.http.post('/visaopf/api/tela/component/detection', formData, {responseType: 'text'})
  }

}
