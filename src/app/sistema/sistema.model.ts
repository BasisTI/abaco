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
  ) { }

  static toNonCircularJson(s: Sistema): Sistema {
    const ms = s.modulos;
    const nonCircularModulos = ms.map(m => Modulo.toNonCircularJson(m));
    return new Sistema(s.id, s.sigla, s.nome, s.numeroOcorrencia,
       s.organizacao, nonCircularModulos);
  }

  addModulo(modulo: Modulo) {
    if (!this.modulos) {
      this.modulos = [];
    }
    // para atualizar dropdown, o array precisa ser recriado
    this.modulos = this.modulos.slice();
    this.modulos.push(modulo);
  }

  get funcionalidades: Funcionalidade[] {
    if (!this.modulos) {
      return [];
    }
    const allFuncs = [];
    this.modulos.forEach(function (m) {
      if (m.funcionalidades) {
        m.funcionalidades.forEach(f => f.modulo = m);
        allFuncs.push(m.funcionalidades);
      }
    });
    return allFuncs.reduce((a, b) => a.concat(b), []);
  }

  addFuncionalidade(funcionalidade: Funcionalidade) {
    const modulo = this.findModulo(funcionalidade.modulo);
    modulo.addFuncionalidade(funcionalidade);
  }

  private findModulo(modulo: Modulo): Modulo {
    // FIXME
    return _.find(this.modulos, { 'nome': modulo.nome });
  }

}
