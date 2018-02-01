import { BaseEntity } from '../shared';
import { FatorAjuste } from '../fator-ajuste/index';
import { Funcionalidade } from '../funcionalidade/index';

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
    public artificialId?: number,
    public tipo?: TipoFuncaoTransacao,
    public complexidade?: Complexidade,
    public pf?: number,
    public analise?: BaseEntity,
    public funcionalidades?: BaseEntity[],
    public funcionalidade?: Funcionalidade,
    public fatorAjuste?: FatorAjuste,
    public alrs?: BaseEntity[],
    public name?: string,
    public sustantation?: string,
    public der?: string,
    public ftr?: string,
    public grossPf?: number,
  ) {
    if (!pf) {
      this.pf = 0;
    }
    if (!grossPf) {
      this.grossPf = 0;
    }
  }
}
