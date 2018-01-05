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
    const allFuncs = this.getAllFuncionalidadesAsArrayOfArrays();
    return allFuncs.reduce((a, b) => a.concat(b), []);
  }

  private getAllFuncionalidadesAsArrayOfArrays(): Array<Array<Funcionalidade>> {
    const allFuncs = [];
    this.modulos.forEach(m => allFuncs.push(this.retrieveFuncionalidadesFromModulo(m)));
    return allFuncs;
  }

  private retrieveFuncionalidadesFromModulo(modulo: Modulo): Funcionalidade[] {
    if (modulo.funcionalidades) {
      modulo.funcionalidades.forEach(f => f.modulo = modulo);
      return modulo.funcionalidades;
    }
    return [];
  }

  addFuncionalidade(funcionalidade: Funcionalidade) {
    const modulo: Modulo = this.mappableModulos.get(funcionalidade.modulo);
    modulo.addFuncionalidade(funcionalidade);
  }

  updateModulo(modulo: Modulo) {
    this.mappableModulos.update(modulo);
    this.modulos = this.mappableModulos.values();
  }

}
