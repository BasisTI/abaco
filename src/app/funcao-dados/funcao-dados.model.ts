import { BaseEntity, JSONable } from '../shared';
import { Funcionalidade } from '../funcionalidade/index';
import { DerTextParser } from '../analise-shared/der-text-parser';
import { FatorAjuste } from '../fator-ajuste/index';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { FuncaoResumivel } from '../analise-shared/resumo-funcoes';
import { FuncaoAnalise } from '../analise-shared/funcao-analise';

export enum TipoFuncaoDados {
  'ALI' = 'ALI',
  'AIE' = 'AIE'
}

export class FuncaoDados implements BaseEntity, FuncaoResumivel,
 FuncaoAnalise, JSONable<FuncaoDados> {

  detStr: string;
  retStr: string;

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
    public grossPF?: number,
    public derValues?: string[],
    public rlrValues?: string[],
  ) {
    if (!pf) {
      this.pf = 0;
    }
    if (!grossPF) {
      this.grossPF = 0;
    }
  }

  static tipos(): string[] {
    return Object.keys(TipoFuncaoDados).map(k => TipoFuncaoDados[k as any]);
  }

  toJSONState(): FuncaoDados {
    const copy: FuncaoDados = Object.assign({}, this);
    copy.derValues = DerTextParser.parse(this.der).textos;
    copy.rlrValues = DerTextParser.parse(this.rlr).textos;


    // FIXME der e rlr estao com valores 0, nao estao sendo setados corretamente
    copy.detStr = copy.der;
    copy.retStr = copy.rlr;

    copy.funcionalidade = Funcionalidade.toNonCircularJson(copy.funcionalidade);

    return copy;
  }

  copyFromJSON(json: any): FuncaoDados {
    return new FuncaoDadosCopyFromJSON(json).copy();
  }

  tipoAsString(): string {
    return this.tipo.toString();
  }

  // XXX eficiente obter vários ParseResult em lugares diferentes?
  // refletir possiveis mudanças em FuncaoTransacao
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
      this.grossPF);
  }

}

class FuncaoDadosCopyFromJSON {

  private _json: any;

  private _funcaoDados; FuncaoDados;

  constructor(json: any) {
    this._json = json;
    this._funcaoDados = new FuncaoDados();
  }

  public copy(): FuncaoDados {
    this.converteValoresTriviais();
    this.converteBaseEntities();
    this.converteFuncionalidade();
    this.converteFatorAjuste();
    this.converteTextos();
    return this._funcaoDados;
  }

  private converteValoresTriviais() {
    this._funcaoDados.id = this._json.id;
    this._funcaoDados.tipo = this._json.tipo;
    this._funcaoDados.complexidade = this._json.complexidade;
    this._funcaoDados.pf = this._json.pf;
    this._funcaoDados.name = this._json.name;
    this._funcaoDados.sustantation = this._json.sustantation;
    this._funcaoDados.grossPF = this._json.grossPF;
    this._funcaoDados.id = this._json.id;
  }

  private converteBaseEntities() {
    this._funcaoDados.analise = this._json.analise;
    this._funcaoDados.funcionalidades = this._json.funcionalidades;
    this._funcaoDados.alr = this._json.alr;
  }

  private converteFuncionalidade() {
    this._funcaoDados.funcionalidade = Funcionalidade.fromJSON(this._json.funcionalidade);
  }

  private converteFatorAjuste() {
    this._funcaoDados.fatorAjuste = new FatorAjuste().copyFromJSON(this._json.fatorAjuste);
  }

  // TODO conferir
  private converteTextos() {
    this._funcaoDados.der = this._json.detStr;
    this._funcaoDados.rlr = this._json.retStr;
  }

}

