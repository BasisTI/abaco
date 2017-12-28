import { BaseEntity } from '../shared';
import { Sistema } from '../sistema';
import { Funcionalidade } from '../funcionalidade';

export class Modulo implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public sistema?: BaseEntity,
    public funcionalidades?: Funcionalidade[],
  ) {}

  static toNonCircularJson(m: Modulo) {
    var fs = m.funcionalidades;
    var nonCircularFuncionalidades = fs.map(f => Funcionalidade.toNonCircularJson(f));
    const mo = new Modulo(m.id, m.nome, undefined, nonCircularFuncionalidades);
    return mo;
  }

  addFuncionalidade(funcionalidade: Funcionalidade) {
    if (!this.funcionalidades)
      this.funcionalidades = [];
    this.funcionalidades.push(funcionalidade);
  }

}
