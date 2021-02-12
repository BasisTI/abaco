import { Modulo } from '../modulo';
import { BaseEntity } from '../shared';

export class Funcionalidade implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public modulo?: Modulo,
    public funcaoDados?: BaseEntity,
    public funcaoTransacao?: BaseEntity,
    public artificialId?: number,
  ) { }

  static fromJSON(json: any) {
    return new Funcionalidade(json.id, json.nome, json.modulo,
      json.funcaoDados, json.FuncaoTransacao);
  }

  static toNonCircularJson(f: Funcionalidade): Funcionalidade {
    return new Funcionalidade(f.id, f.nome, undefined);
  }

  // XXX extrair interface?
  clone(): Funcionalidade {
    // shallow copy
    return new Funcionalidade(this.id, this.nome, this.modulo,
      this.funcaoDados, this.funcaoTransacao, this.artificialId);
  }
}
