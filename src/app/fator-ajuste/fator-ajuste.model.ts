import { BaseEntity } from '../shared';

export const enum TipoFatorAjuste {
  'PERCENTUAL',
  'UNITARIO'
}
export const enum ImpactoFatorAjuste {
  'INCLUSAO',
  'ALTERACAO',
  'EXCLUSAO',
  'CONVERSAO',
  'ITENS_NAO_MENSURAVEIS'
}

export class FatorAjuste implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public fator?: number,
    public ativo?: boolean,
    public codigo?: string,
    public tipoAjuste?: TipoFatorAjuste,
    public impacto?: ImpactoFatorAjuste,
    public manual?: BaseEntity,
  ) {}
}
