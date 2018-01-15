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

  toJSONState(): FatorAjuste {
    const copy: FatorAjuste = Object.assign({}, this);
    return copy;
  }

  copyFromJSON(json: any) {
    // TODO converter manual?
    return new FatorAjuste(json.id, json.nome, json.fator, json.ativo, json.codigo, json.tipoAjuste, json.impacto, json.manual);
  }

  // TODO extrair modulo? entrar pro jsonable?
  clone(): FatorAjuste {
    return new FatorAjuste(this.id, this.nome, this.fator, this.ativo, this.codigo, this.tipoAjuste, this.impacto, this.manual);
  }


}
