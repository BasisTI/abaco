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

  showTotal(): string {
    if (this.numero) {
      return this.numero.toString();
    } else {
      return this.textos.length.toString();
    }
  }
}

export class DerTextParser {

  static parse(entrada: string): ParseResult {
    if (this.isEmptyString(entrada)) {
      return this.gerarResultadoTextualVazio();
    } else if (this.isNumerico(entrada)) {
      return this.gerarResultadoNumerico(entrada);
    } else {
      return this.gerarResultadoTextual(entrada);
    }
  }

  private static isEmptyString(entrada: string) {
    return (!entrada || 0 === entrada.length);
  }

  private static gerarResultadoTextualVazio() {
    return new ParseResult(ParseResult.TEXTO_TIPO, undefined, []);
  }

  private static isNumerico(entrada): boolean {
    return !isNaN(entrada);
  }

  private static gerarResultadoNumerico(entrada: string): ParseResult {
    return new ParseResult(ParseResult.NUMERO_TIPO,
      _.toNumber(entrada));
  }

  private static gerarResultadoTextual(entrada: string): ParseResult {
    const textosPreTrim: string[] = entrada.split(/\r\n|\r|\n/g);
    const textos: string[] = textosPreTrim.map(t => _.trim(t));
    return new ParseResult(ParseResult.TEXTO_TIPO,
      undefined, textos);
  }
}
