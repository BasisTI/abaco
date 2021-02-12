import { BaseEntity} from '../shared';
import { AnaliseReferenciavel } from '../analise-shared/analise-referenciavel';
import { FuncaoDados } from '../funcao-dados';
import { FuncaoTransacao } from '../funcao-transacao';

export class Der implements BaseEntity, AnaliseReferenciavel {

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
