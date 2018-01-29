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
    public tipo?: TipoFuncaoDados,
    public complexidade?: Complexidade,
    public pf?: number,
    public analise?: BaseEntity,
    public funcionalidades?: BaseEntity[],
    public funcionalidade?: Funcionalidade,
    public fatorAjuste?: BaseEntity,
    public alr?: BaseEntity,
    public name?: string,
  ) { }
}
