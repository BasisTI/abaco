import { BaseEntity } from '../shared';
import { FatorAjuste } from '../fator-ajuste/index';
import { Funcionalidade } from '../funcionalidade/index';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { DerTextParser } from '../analise-shared/der-text-parser';

export enum TipoFuncaoTransacao {
  'EE' = 'EE', // entrada externa
  'SE' = 'SE', // saida externa
  'CE' = 'CE' // consulta externa
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

  derValue(): number {
    if (!this.der) {
      return 0;
    }
    return DerTextParser.parse(this.der).total();
  }

  ftrValue(): number {
    if (!this.ftr) {
      return 0;
    }
    return DerTextParser.parse(this.ftr).total();
  }

  clone(): FuncaoTransacao {
    return new FuncaoTransacao(this.id, this.artificialId, this.tipo,
      this.complexidade, this.pf, this.analise, this.funcionalidades,
      this.funcionalidade, this.fatorAjuste, this.alrs,
      this.name, this.sustantation, this.der, this.ftr, this.grossPf);
  }
}
