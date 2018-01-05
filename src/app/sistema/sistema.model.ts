import { BaseEntity, MappableEntities } from '../shared';
import { Modulo } from '../modulo';
import { Funcionalidade } from '../funcionalidade';

export class Sistema implements BaseEntity {

  private mappableModulos: MappableEntities<Modulo>;

  constructor(
    public id?: number,
    public sigla?: string,
    public nome?: string,
    public numeroOcorrencia?: string,
    public organizacao?: BaseEntity,
    public modulos?: Modulo[],
  ) {
    if (modulos) {
      this.mappableModulos = new MappableEntities<Modulo>(modulos);
    } else {
      this.mappableModulos = new MappableEntities<Modulo>();
    }
  }

  static fromJSON(json: any): Sistema {
    const modulos = json.modulos.map(m => Modulo.fromJSON(m));
    const newSistema = new Sistema(json.id, json.sigla,
      json.nome, json.numeroOcorrencia, json.organizacao,
      modulos);
    return newSistema;
  }

  static toNonCircularJson(s: Sistema): Sistema {
    const nonCircularModulos = s.modulos.map(m => Modulo.toNonCircularJson(m));
    return new Sistema(s.id, s.sigla, s.nome, s.numeroOcorrencia,
      s.organizacao, nonCircularModulos);
  }

  addModulo(modulo: Modulo) {
    this.mappableModulos.push(modulo);
    this.modulos = this.mappableModulos.values();
  }

  get funcionalidades(): Funcionalidade[] {
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
    const modulo: Modulo = this.mappableModulos.get(funcionalidade.modulo);
    modulo.addFuncionalidade(funcionalidade);
  }

}
