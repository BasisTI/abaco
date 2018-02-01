import { BaseEntity } from '../shared';
import { Funcionalidade } from '../funcionalidade/index';
import { DerTextParser } from '../analise-shared/der-text-parser';
import { FatorAjuste } from '../fator-ajuste/index';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { FuncaoResumivel } from '../analise-shared/resumo-funcoes';

export enum TipoFuncaoDados {
  'ALI' = 'ALI',
  'AIE' = 'AIE'
}

export class FuncaoDados implements BaseEntity, FuncaoResumivel {

  constructor(
    public id?: number,
    public artificialId?: number,
    public tipo?: TipoFuncaoDados,
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
  ) {
    if (!pf) {
      this.pf = 0;
    }
    if (!grossPf) {
      this.grossPf = 0;
    }
  }

  static tipos(): string[] {
    return Object.keys(TipoFuncaoDados).map(k => TipoFuncaoDados[k as any]);
  }

  tipoAsString(): string {
    return this.tipo.toString();
  }

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
