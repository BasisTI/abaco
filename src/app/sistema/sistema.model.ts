import { BaseEntity } from '../shared';
import { Modulo } from '../modulo';


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
    this.modulos.push(modulo);
  }

  get funcionalidades(): BaseEntity[] {
    var allFuncs = this.modulos.map(m => m.funcionalidades);
    return allFuncs.reduce((a, b) => a.concat(b), []);
  }
}
