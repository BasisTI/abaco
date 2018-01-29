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
    return undefined;
  }
}