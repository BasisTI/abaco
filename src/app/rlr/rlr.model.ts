import { BaseEntity, JSONable } from '../shared';
import { FuncaoDados } from '../funcao-dados/funcao-dados.model';

export class Rlr implements BaseEntity, JSONable<Rlr> {

  constructor(
    public id?: number,
    public nome?: string,
    public valor?: number,
    public funcaoDados?: FuncaoDados
  ) { }

  toJSONState(): Rlr {
    return Object.assign({}, this);
  }

  copyFromJSON(json: any): Rlr {
    return Object.assign(new Rlr(), json);
  }

}
