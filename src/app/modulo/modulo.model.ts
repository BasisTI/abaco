import { BaseEntity } from '../shared';
import { Funcionalidade } from '../funcionalidade';


export class Modulo implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public sistema?: BaseEntity,
    public funcionalidades?: Funcionalidade[],
  ) {}

  addFuncionalidade(funcionalidade: Funcionalidade) {
    if(!this.funcionalidades)
      this.funcionalidades = [];
    this.funcionalidades.push(funcionalidade);
  }

  safeFuncionalidades(): Funcionalidade[] {
    if(!this.funcionalidades)
      return [];
    else
      return this.funcionalidades;
  }

  toNonCircularJson(): Modulo {
    var fs = this.funcionalidades;
    var nonCircularFuncionalidades: Funcionalidade[] = fs.map(f => f.toNonCircularJson());
    return new Modulo(this.id, this.nome, undefined, nonCircularFuncionalidades);
  }
}
