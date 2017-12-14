import { BaseEntity } from '../shared';

export const enum TipoFuncaoTransacao {
  'EE',
  'SE',
  'CE'
}
export const enum Complexidade {
  'BAIXA',
  'MEDIA',
  'ALTA'
}

export class FuncaoTransacao implements BaseEntity {

  constructor(
    public id?: number,
    public tipo?: TipoFuncaoTransacao,
    public complexidade?: Complexidade,
    public pf?: number,
    public analise?: BaseEntity,
    public funcionalidades?: BaseEntity[],
    public fatorAjuste?: BaseEntity,
    public alrs?: BaseEntity[],
  ) {}
}
