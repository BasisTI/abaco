import { BaseEntity } from '../shared';
import { IntToFloatParser } from '../shared/int-to-float-parser';

export enum TipoFatorAjuste {
  'PERCENTUAL' = 'PERCENTUAL',
  'UNITARIO' = 'UNITARIO'
}
export enum ImpactoFatorAjuste {
  'INCLUSAO' = 'INCLUSAO',
  'ALTERACAO' = 'ALTERACAO',
  'EXCLUSAO' = 'EXCLUSAO',
  'CONVERSAO' = 'CONVERSAO',
  'ITENS_NAO_MENSURAVEIS' = 'ITENS_NAK_MENSURAVEIS'
}

export class FatorAjuste implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    // FIXME soluciona no back. tipo deve ser 'number'
    public fator?: any,
    public ativo?: boolean,
    public descricao?: string,
    public codigo?: string,
    public tipoAjuste?: TipoFatorAjuste,
    public impacto?: ImpactoFatorAjuste,
    public manual?: BaseEntity,
    public origem?: string,
    public artificialId?: number
  ) { }

  toJSONState(): FatorAjuste {
    const copy: FatorAjuste = Object.assign({}, this);
    copy.fator = IntToFloatParser.parse(this.fator);
    return copy;
  }

  copyFromJSON(json: any) {
    // TODO converter manual?
    return new FatorAjuste(json.id, json.nome, json.fator, json.ativo,
      json.descricao, json.codigo, json.tipoAjuste, json.impacto, json.manual,
      json.origem, json.artificialId);
  }

  // TODO extrair modulo? entrar pro jsonable?
  clone(): FatorAjuste {
    return new FatorAjuste(this.id, this.nome, this.fator, this.ativo,
      this.descricao, this.codigo, this.tipoAjuste, this.impacto, this.manual,
      this.origem, this.artificialId);
  }

  get fatorFormatado(): number {
    return this.fatorVisualizavel();
  }

  set fatorFormatado(fator: number) {
    if (this.isPercentual()) {
      this.fator = fator / 100;
    } else {
      this.fator = fator;
    }
  }

  fatorVisualizavel(): number {
    if (this.fator) {
      return this.calculaFatorVisualizavel();
    }
  }

  private calculaFatorVisualizavel(): number {
    if (this.isPercentual()) {
      return this.fator * 100;
    }
    return this.fator;
  }

  isPercentual(): boolean {
    return this.tipoAjuste === TipoFatorAjuste.PERCENTUAL;
  }

  isUnitario(): boolean {
    return this.tipoAjuste === TipoFatorAjuste.UNITARIO;
  }


}
