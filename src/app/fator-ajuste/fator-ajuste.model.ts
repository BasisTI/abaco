import { BaseEntity } from '../shared';
import { Manual } from '../manual';

export enum TipoFatorAjuste {
  'PERCENTUAL' = 'PERCENTUAL',
  'UNITARIO' = 'UNITARIO'
}
export enum ImpactoFatorAjuste {
  'INCLUSAO' = 'INCLUSAO',
  'ALTERACAO' = 'ALTERACAO',
  'EXCLUSAO' = 'EXCLUSAO',
  'CONVERSAO' = 'CONVERSAO',
  'ITENS_NAO_MENSURAVEIS' = 'ITENS_NAO_MENSURAVEIS'
}

export class FatorAjuste implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public fator?: number,
    public ativo?: boolean,
    public descricao?: string,
    public codigo?: string,
    public tipoAjuste?: TipoFatorAjuste,
    public impacto?: ImpactoFatorAjuste,
    public manual?: Manual,
    public origem?: string,
    public artificialId?: number
  ) { }

  toJSONState(): FatorAjuste {
    const copy: FatorAjuste = Object.assign({}, this);
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
    return this.fator;
  }

  set fatorFormatado(fator: number) {
    if (typeof fator === 'string') {
      fator = Number(fator);
    }
      this.fator = fator;
  }

  isPercentual(): boolean {
    return this.tipoAjuste === TipoFatorAjuste.PERCENTUAL;
  }

  isUnitario(): boolean {
    return this.tipoAjuste === TipoFatorAjuste.UNITARIO;
  }

  /**
   * VERIFICAR CALCULO - Função que aplica o fator de ajuste
   * @param pf Pontos de Função a receber fator de ajuste
   */
  aplicarFator(pf: number): number {
    if (this.isUnitario()) {
      return this.fator;
    } else {
      return pf * this.fator;
    }
  }


}
