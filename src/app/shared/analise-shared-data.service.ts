import { Injectable } from '@angular/core';
import { Analise } from '../analise/';

import * as _ from 'lodash';

@Injectable()
export class AnaliseSharedDataService {

  analise: Analise;

  isContratoSelected(): boolean {
    return !_.isUndefined(this.analise.contrato);
  }

}
