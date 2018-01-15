import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeBoolean'
})
export class ActiveBooleanPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let transformedValue = "";
    if(value) {
      transformedValue = "S";
    } else {
      transformedValue = "N";
    }
    return transformedValue;
  }

}
