import * as _ from 'lodash';

export class IntToFloatParser {

  static parse(value: number): string {
    if (_.isInteger(value)) {
      return value.toFixed(1);
    }
    return value.toString();
  }

}
