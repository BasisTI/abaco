import { BaseEntity } from '../shared';
import { Funcionalidade } from '../funcionalidade';


export class Modulo implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public sistema?: BaseEntity,
    public funcionalidades?: Funcionalidade[],
  ) {}

  addFuncionalidade(funcionalidade: BaseEntity) {
    if(!this.funcionalidades)
      this.funcionalidades = [];
    this.funcionalidades.push(funcionalidade);
  }
}
