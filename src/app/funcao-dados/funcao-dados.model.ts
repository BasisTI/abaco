import { BaseEntity } from '../shared';
import { Funcionalidade } from '../funcionalidade/index';

const enum TipoFuncaoDados {
  'ALI',
  'AIE'
}

const enum Complexidade {
  'BAIXA',
  'MEDIA',
  'ALTA'
}

export class FuncaoDados implements BaseEntity {

  constructor(
    public id?: number,
    public artificialId?: number,
    public tipo?: string,
    public complexidade?: Complexidade,
    public pf?: number,
    public analise?: BaseEntity,
    public funcionalidades?: BaseEntity[],
    public funcionalidade?: Funcionalidade,
    public fatorAjuste?: BaseEntity,
    public alr?: BaseEntity,
    public name?: string,
    public sustantation?: string,
  ) { }

  clone(): FuncaoDados {
    return new FuncaoDados(this.id, this.artificialId, this.tipo, this.complexidade,
      this.pf, this.analise, this.funcionalidades, this.funcionalidade,
      this.fatorAjuste, this.alr, this.name, this.sustantation);
  }
}
