import { BaseEntity } from '../shared';

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
    public fatorAjuste?: BaseEntity,
    public alr?: BaseEntity,
    public name?: string,
  ) { }
}
