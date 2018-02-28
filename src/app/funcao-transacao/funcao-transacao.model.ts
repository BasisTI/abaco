import { BaseEntity, JSONable } from '../shared';
import { FatorAjuste } from '../fator-ajuste/index';
import { Funcionalidade } from '../funcionalidade/index';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { DerTextParser, ParseResult } from '../analise-shared/der-text/der-text-parser';
import { FuncaoResumivel } from '../analise-shared/resumo-funcoes';
import { FuncaoAnalise } from '../analise-shared/funcao-analise';
import { Der } from '../der/der.model';
import { DerChipConverter } from '../analise-shared/der-chips/der-chip-converter';
import { Alr } from '../alr/alr.model';

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
    public alrs?: Alr[],
    public name?: string,
    public sustantation?: string,
    public der?: string,
    public ftr?: string,
    public grossPF?: number,
    public derValues?: string[],
    public ftrValues?: string[],
    public ders?: Der[],
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
    copy.derValues = DerTextParser.parse(this.der).textos;
    copy.ftrValues = DerTextParser.parse(this.ftr).textos;
    copy.detStr = copy.der;
    copy.ftrStr = copy.ftr;

    copy.funcionalidade = Funcionalidade.toNonCircularJson(copy.funcionalidade);

    copy.ders = this.ders.map(der => der.toJSONState());
    copy.alrs = this.alrs.map(alr => alr.toJSONState());

    return copy;
  }

  copyFromJSON(json: any): FuncaoTransacao {
    return new FuncaoTransacaoCopyFromJSON(json).copy();
  }

  tipoAsString(): string {
    return this.tipo.toString();
  }

  derValue(): number {
    if (this.ders && this.ders.length > 0) {
      return DerChipConverter.valor(this.ders);
    } else if (!this.der) {
      return 0;
    }
    return DerTextParser.parse(this.der).total();
  }

  ftrValue(): number {
    if (this.alrs && this.alrs.length > 0) {
      return DerChipConverter.valor(this.alrs);
    } else if (!this.ftr) {
      return 0;
    }
    return DerTextParser.parse(this.ftr).total();
  }

  clone(): FuncaoTransacao {
    return new FuncaoTransacao(this.id, this.artificialId, this.tipo,
      this.complexidade, this.pf, this.analise, this.funcionalidades,
      this.funcionalidade, this.fatorAjuste, this.alrs,
      this.name, this.sustantation, this.der, this.ftr, this.grossPF,
      this.derValues, this.ftrValues, this.ders);
  }
}

// TODO bem duplicado com FuncaoDados
class FuncaoTransacaoCopyFromJSON {

  private _json: any;

  private _funcaoTransacao; FuncaoTransacao;

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
    this.converteDers();
    this.converteAlrs();
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

    this._funcaoTransacao.derValues = this.converteTexto(this._json.detStr);
    this._funcaoTransacao.ftrValues = this.converteTexto(this._json.ftrStr);
  }

  private converteTexto(texto: any): string[] {
    const parseResult: ParseResult = DerTextParser.parse(texto);
    if (parseResult.isTipoNumerico()) {
      return [parseResult.numero.toString()];
    } else {
      return parseResult.textos;
    }
  }

  private converteDers() {
    this._funcaoTransacao.ders = this._json.ders.map(
      der => new Der().copyFromJSON(der)
    );
  }

  private converteAlrs() {
    // XXX esquisito. rlrs vem vazio quando não tem, alrs não
    if (!this._json.alrs) {
      this._funcaoTransacao.alrs = [];
    } else {
      this._funcaoTransacao.alrs = this._json.alrs.map(
        alr => new Alr().copyFromJSON(alr)
      );
    }
  }
}
