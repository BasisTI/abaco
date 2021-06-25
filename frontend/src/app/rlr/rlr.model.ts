import { BaseEntity } from '../shared';
import { AnaliseReferenciavel } from '../analise-shared/analise-referenciavel';
import { FuncaoDados } from '../funcao-dados';

export class Rlr implements BaseEntity, AnaliseReferenciavel{

  constructor(
    public id?: number,
    public nome?: string,
    public valor?: number,
    public funcaoDados?: FuncaoDados,
    public numeracao?: number
  ) { }

  toJSONState(): Rlr {
    return Object.assign({}, this);
  }

  copyFromJSON(json: any): Rlr {
    return Object.assign(new Rlr(), json);
  }

}
