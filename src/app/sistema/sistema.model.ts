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

  static toNonCircularJson(s: Sistema): Sistema {
    var ms = s.modulos;
    var nonCircularModulos = ms.map(m => Modulo.toNonCircularJson(m));
    s.modulos = nonCircularModulos;
    return s;
  }

  addModulo(modulo: Modulo) {
    if(!this.modulos)
      this.modulos = [];
    // para atualizar dropdown, o array precisa ser recriado
    this.modulos = this.modulos.slice();
    this.modulos.push(modulo);
  }

  get funcionalidades: Funcionalidade[] {
    if (!this.modulos) return [];
    let modulos: Modulo[] = this.modulos;
    var allFuncs = [];
    modulos.forEach(function(m) {
      if (m.funcionalidades) {
        m.funcionalidades.forEach(f => f.modulo = m);
        allFuncs.push(m.funcionalidades);
      }
    });
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
