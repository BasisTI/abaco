import { Injectable } from '@angular/core'
import {Observable} from 'rxjs'
import {HttpClient, HttpParams} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class VisaoPfListModelsService {

  constructor(private http: HttpClient) {
  }

  getAllModels(){
    return this.http.get(`/visaopf/api/all/models/`)
  }

}
