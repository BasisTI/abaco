import { BaseEntity, MappableEntities } from '../shared';
import { Sistema } from '../sistema';
import { Funcionalidade } from '../funcionalidade';

export class Modulo implements BaseEntity {

  private mappableFuncionalidades: MappableEntities<Funcionalidade>;

  constructor(
    public id?: number,
    public nome?: string,
    public sistema?: BaseEntity,
    public funcionalidades?: Funcionalidade[],
    public artificialId?: number,
  ) {
    if (funcionalidades) {
      this.mappableFuncionalidades = new MappableEntities<Funcionalidade>(funcionalidades);
    } else {
      this.mappableFuncionalidades = new MappableEntities<Funcionalidade>();
    }
  }

  static fromJSON(json: any): Modulo {
    const funcionalidades = json.funcionalidades.map(
      f => Funcionalidade.fromJSON(f));
    return new Modulo(json.id, json.nome, json.sistema, funcionalidades);
  }

  static toNonCircularJson(m: Modulo) {
    const nonCircularFuncionalidades = m.funcionalidades.map(
      f => Funcionalidade.toNonCircularJson(f));
    return new Modulo(m.id, m.nome, undefined, nonCircularFuncionalidades);
  }

  addFuncionalidade(funcionalidade: Funcionalidade) {
    this.mappableFuncionalidades.push(funcionalidade);
    this.funcionalidades = this.mappableFuncionalidades.values();
  }

}
