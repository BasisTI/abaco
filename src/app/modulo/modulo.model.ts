import { BaseEntity } from '../shared';
import { Funcionalidade } from '../funcionalidade';
import { MappableEntities } from '../shared/mappable-entities';

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
      funcionalidades.forEach(f => f.modulo = this);
      this.mappableFuncionalidades = new MappableEntities<Funcionalidade>(funcionalidades);
    } else {
      this.funcionalidades = [];
      this.mappableFuncionalidades = new MappableEntities<Funcionalidade>();
    }
  }

  static fromJSON(json: any): Modulo {
    let funcionalidades = [];
    if (json.funcionalidades) {
      funcionalidades = json.funcionalidades.map(
        f => Funcionalidade.fromJSON(f));
    }
    return new Modulo(json.id, json.nome, json.sistema, funcionalidades);
  }

  static toNonCircularJson(m: Modulo) {
    const newModulo: Modulo = new Modulo(m.id, m.nome);

    const nonCircularFuncionalidades = m.funcionalidades.map(
      f => Funcionalidade.toNonCircularJson(f));

    newModulo.funcionalidades = nonCircularFuncionalidades;
    return newModulo;
  }

  addFuncionalidade(funcionalidade: Funcionalidade) {
    this.mappableFuncionalidades.push(funcionalidade);
    this.funcionalidades = this.mappableFuncionalidades.values();
  }

  updateFuncionalidade(funcionalidade: Funcionalidade) {
    this.mappableFuncionalidades.update(funcionalidade);
    this.funcionalidades = this.mappableFuncionalidades.values();
  }

  deleteFuncionalidade(funcionalidade: Funcionalidade) {
    this.mappableFuncionalidades.delete(funcionalidade);
    this.funcionalidades = this.mappableFuncionalidades.values();
  }

  // XXX extrair interface?
  clone(): Modulo {
    // shallow copy funciona aqui pois a edição só é feita no NOME
    return new Modulo(this.id, this.nome, this.sistema,
      this.funcionalidades, this.artificialId);
  }

}
