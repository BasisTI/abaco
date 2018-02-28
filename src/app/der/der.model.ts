import { BaseEntity, JSONable } from '../shared';
import { AnaliseReferenciavel } from '../analise-shared/analise-referenciavel';
import { FuncaoTransacao } from '../funcao-transacao/funcao-transacao.model';
import { FuncaoDados } from '../funcao-dados/funcao-dados.model';

export class Der implements BaseEntity, AnaliseReferenciavel, JSONable<Der> {

  constructor(
    public id?: number,
    public nome?: string,
    public valor?: number,
    public funcaoDados?: FuncaoDados,
    public funcaoTransacao?: FuncaoTransacao,
  ) { }

  toJSONState(): Der {
    return Object.assign({}, this);
  }

  copyFromJSON(json: any): Der {
    return Object.assign(new Der(), json);
  }

}
