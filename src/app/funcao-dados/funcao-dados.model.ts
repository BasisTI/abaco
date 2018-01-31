import { BaseEntity } from '../shared';
import { Funcionalidade } from '../funcionalidade/index';
import { DerTextParser } from '../analise-shared/der-text-parser';
import { MetodoContagem } from '../analise/index';
import { FatorAjuste } from '../fator-ajuste/index';

const enum TipoFuncaoDados {
  'ALI',
  'AIE'
}

export const enum Complexidade {
  'SEM',
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
    public fatorAjuste?: FatorAjuste,
    public alr?: BaseEntity,
    public name?: string,
    public sustantation?: string,
    public der?: string,
    public rlr?: string,
    public grossPf?: number,
  ) { }

  // XXX eficiente obter vários ParseResult em lugares diferentes?
  derValue(): number {
    if (!this.der) {
      return 0;
    }
    return DerTextParser.parse(this.der).total();
  }

  rlrValue(): number {
    if (!this.rlr) {
      return 0;
    }
    return DerTextParser.parse(this.rlr).total();
  }

  clone(): FuncaoDados {
    return new FuncaoDados(this.id, this.artificialId, this.tipo, this.complexidade,
      this.pf, this.analise, this.funcionalidades, this.funcionalidade,
      this.fatorAjuste, this.alr, this.name, this.sustantation, this.der, this.rlr,
      this.grossPf);
  }

}
