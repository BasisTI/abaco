import { Injectable } from '@angular/core';

@Injectable()
export class GenericService {

  constructor() { }

  convertJsonToObject(json: any, object: any){
    return Object.assign(object, json);
  }
}
