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
    return this.http.put('/visaopf/componente', component, {responseType: 'text'})
  }

  getListAnalises(){
    return this.http.get("/visaopf/analise")
  }

  getCenario(id:string){
    return this.http.get(`/visaopf/cenario/${id}`)
  }

  getAnalise(id:string){
    return this.http.get(`/visaopf/analise/${id}`)
  }

  getProcessoContagem(uuid:string){
    return this.http.get(`/visaopf/processo/${uuid}`)
  }

  getProcessoContagemByCenario(cenarioId:string){
    return this.http.get(`/visaopf/processo/cenario/${cenarioId}`)
  }

  getTela(id:string){
    return this.http.get(`/visaopf/tela/${id}`)
  }

  getComponent(id:string){
    return this.http.get(`/visaopf/componente/${id}`)
  }

  getTiposComponent(){
    return this.http.get("/visaopf/componente/tipos")
  }

  getTelaByUuid(uuid:string){
    return this.http.get(`/visaopf/tela/uuid/${uuid}`)
  }

  sendComponentDetection(visaopf: any): Observable<any> {
    let formData: FormData = new FormData()

    for(const tela of visaopf.cenario.telas){
        formData.append('telas', tela.imagem, tela.originalImageName )
    }

    return this.http.post('/visaopf/tela/component/detection', formData, {responseType: 'text'})
  }

}
