import * as _ from 'lodash';

export class ParseResult {

  static readonly NUMERO_TIPO = 'NUMERO';
  static readonly TEXTO_TIPO = 'TEXTO';

  readonly tipo: string;

  readonly numero: number;

  readonly textos: string[];

  constructor(tipo: string, numero?: number, textos?: string[]) {
    this.tipo = tipo;
    this.numero = numero;
    this.textos = textos;
  }
}

export class DerTextParser {

  static parse(entrada: string): ParseResult {
    if (this.isNumerico(entrada)) {
      return this.gerarResultadoNumerico(entrada);
    }
  }

  private static isNumerico(entrada): boolean {
    return !isNaN(entrada);
  }

  private static gerarResultadoNumerico(entrada: string): ParseResult {
    return new ParseResult(ParseResult.NUMERO_TIPO,
      _.toNumber(entrada));
  }
}