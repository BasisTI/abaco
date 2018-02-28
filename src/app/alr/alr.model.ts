import { BaseEntity, JSONable } from '../shared';
import { AnaliseReferenciavel } from '../analise-shared/analise-referenciavel';
import { FuncaoTransacao } from '../funcao-transacao/funcao-transacao.model';

export class Alr implements BaseEntity, AnaliseReferenciavel, JSONable<Alr> {

  constructor(
    public id?: number,
    public nome?: string,
    public valor?: number,
    public funcaoTransacao?: FuncaoTransacao,
  ) { }

  toJSONState(): Alr {
    return Object.assign({}, this);
  }

  copyFromJSON(json: any): Alr {
    return Object.assign(new Alr(), json);
  }

}
