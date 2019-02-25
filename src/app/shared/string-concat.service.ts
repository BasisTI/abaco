import { Injectable } from '@angular/core';

@Injectable()
export class StringConcatService {

  constructor() { }

  concatResults(paramsArray: Array<string>): string {
    let paramsQueue: Array<string> = [];

    if (paramsArray) {
      paramsArray.forEach(each => {
        (each !== undefined) ? (paramsQueue.push(each)) : (each);
      });
    }

    let concatResultString = this.createString(paramsQueue);

    return concatResultString;
  }

  private createString(paramsQueue: Array<String>): string {
    let concatedString: string = '';

    for(let i = 0 ; i< paramsQueue.length ; i ++) {
      (i !== 0) ? (concatedString = concatedString + ' + ' + paramsQueue[i]) : (concatedString = concatedString + paramsQueue[0]);
    }
    
    return concatedString;
  }
}
