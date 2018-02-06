import { BaseEntity, JSONable } from '../shared';
import { FatorAjuste } from '../fator-ajuste/index';
import { Funcionalidade } from '../funcionalidade/index';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { DerTextParser } from '../analise-shared/der-text-parser';
import { FuncaoResumivel } from '../analise-shared/resumo-funcoes';
import { FuncaoAnalise } from '../analise-shared/funcao-analise';

export enum TipoFuncaoTransacao {
  'EE' = 'EE', // entrada externa
  'SE' = 'SE', // saida externa
  'CE' = 'CE' // consulta externa
}

export class FuncaoTransacao implements BaseEntity, FuncaoResumivel,
  FuncaoAnalise, JSONable<FuncaoTransacao> {

  detStr: string;
  ftrStr: string;

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
    public grossPF?: number,
    public derValues?: string[],
    public ftrValues?: string[],
  ) {
    if (!pf) {
      this.pf = 0;
    }
    if (!grossPF) {
      this.grossPF = 0;
    }
  }

  static tipos(): string[] {
    return Object.keys(TipoFuncaoTransacao).map(k => TipoFuncaoTransacao[k as any]);
  }

  toJSONState(): FuncaoTransacao {
    const copy: FuncaoTransacao = Object.assign({}, this);
    // XXX "compartilhar" DerTextParser? (derValue())
    copy.derValues = DerTextParser.parse(this.der).textos;
    copy.ftrValues = DerTextParser.parse(this.ftr).textos;
    copy.detStr = copy.der;
    copy.ftrStr = copy.ftr;
    copy.funcionalidade = Funcionalidade.toNonCircularJson(copy.funcionalidade);
    // TODO converter funcionalidades

    return copy;
  }

  copyFromJSON(json: any): FuncaoTransacao {
    return new FuncaoTransacaoCopyFromJSON(json).copy();
  }

  tipoAsString(): string {
    return this.tipo.toString();
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
      this.name, this.sustantation, this.der, this.ftr, this.grossPF);
  }
}

// TODO bem duplicado com FuncaoDados
class FuncaoTransacaoCopyFromJSON {

  private _json: any;

  private _funcaoTransacao; FuncaoDados;

  constructor(json: any) {
    this._json = json;
    this._funcaoTransacao = new FuncaoTransacao();
  }

  public copy(): FuncaoTransacao {
    this.converteValoresTriviais();
    this.converteBaseEntities();
    this.converteFuncionalidade();
    this.converteFatorAjuste();
    this.converteTextos();
    return this._funcaoTransacao;
  }

  private converteValoresTriviais() {
    this._funcaoTransacao.id = this._json.id;
    this._funcaoTransacao.tipo = this._json.tipo;
    this._funcaoTransacao.complexidade = this._json.complexidade;
    this._funcaoTransacao.pf = this._json.pf;
    this._funcaoTransacao.name = this._json.name;
    this._funcaoTransacao.sustantation = this._json.sustantation;
    this._funcaoTransacao.grossPF = this._json.grossPF;
  }

  private converteBaseEntities() {
    this._funcaoTransacao.analise = this._json.analise;
    this._funcaoTransacao.funcionalidades = this._json.funcionalidades;
    this._funcaoTransacao.alrs = this._json.alrs;
  }

  private converteFuncionalidade() {
    this._funcaoTransacao.funcionalidade = Funcionalidade.fromJSON(this._json.funcionalidade);
  }

  private converteFatorAjuste() {
    this._funcaoTransacao.fatorAjuste = new FatorAjuste().copyFromJSON(this._json.fatorAjuste);
  }

  private converteTextos() {
    this._funcaoTransacao.der = this._json.detStr;
    this._funcaoTransacao.ftr = this._json.ftrStr;
  }

}
