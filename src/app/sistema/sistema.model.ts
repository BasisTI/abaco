import { BaseEntity } from '../shared';
import { Modulo } from '../modulo';
import { Funcionalidade } from '../funcionalidade';

import * as _ from 'lodash';

export class Sistema implements BaseEntity {

  constructor(
    public id?: number,
    public sigla?: string,
    public nome?: string,
    public numeroOcorrencia?: string,
    public organizacao?: BaseEntity,
    public modulos?: Modulo[],
  ) {}

  addModulo(modulo: Modulo) {
    if(!this.modulos)
      this.modulos = [];
    // para atualizar dropdown, o array precisa recriado
    this.modulos = this.modulos.slice();
    this.modulos.push(modulo);
  }

  get funcionalidades(): Funcionalidade[] {
    if (!this.modulos) return [];
    var allFuncs = this.modulos.map(m => m.safeFuncionalidades());
    var result = allFuncs.reduce((a, b) => a.concat(b), []);
    return result;
  }

  addFuncionalidade(funcionalidade: Funcionalidade) {
    var modulo = this.findModulo(funcionalidade.modulo);
    modulo.addFuncionalidade(funcionalidade);
  }

  private findModulo(modulo: Modulo): Modulo {
    // FIXME
    return _.find(this.modulos, {'nome': modulo.nome });
  }
}
