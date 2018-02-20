import { TipoFuncaoTransacao } from '../../funcao-transacao/funcao-transacao.model';
import { Complexidade } from '../complexidade-enum';

export class ComplexidadeFuncionalTransacao {

  static calcular(tipo: TipoFuncaoTransacao,
    derValor: number, ftrValor: number): Complexidade {

    if (tipo === TipoFuncaoTransacao.EE) {
      return this.calculaEE(derValor, ftrValor);
    } else {
      return this.calculaSEeCE(derValor, ftrValor);
    }
  }

  private static calculaEE(derValor: number, ftrValor: number) {
    if (this.isPrimeiraColunaEE(derValor)) {
      return this.calcularEEPorIntervaloFTR(ftrValor,
        Complexidade.BAIXA, Complexidade.BAIXA, Complexidade.MEDIA);
    } else if (this.isSegundaColunaEE(derValor)) {
      return this.calcularEEPorIntervaloFTR(ftrValor,
        Complexidade.BAIXA, Complexidade.MEDIA, Complexidade.ALTA);
    } else if (this.isTerceiraColunaEE(derValor)) {
      return this.calcularEEPorIntervaloFTR(ftrValor,
        Complexidade.MEDIA, Complexidade.ALTA, Complexidade.ALTA);
    }
  }

  static isPrimeiraColunaEE(der: number): boolean {
    return der < 5;
  }

  static isSegundaColunaEE(der: number): boolean {
    return der >= 5 && der <= 15;
  }

  static isTerceiraColunaEE(der: number): boolean {
    return der > 15;
  }

  private static calcularEEPorIntervaloFTR(ftrValor: number,
    c1: Complexidade, c2: Complexidade, c3: Complexidade) {

    if (this.isPrimeiraLinhaEE(ftrValor)) {
      return c1;
    } else if (this.isSegundaLinhaEE(ftrValor)) {
      return c2;
    } else if (this.isTerceiraLinhaEE(ftrValor)) {
      return c3;
    }
  }

  static isPrimeiraLinhaEE(ftr: number): boolean {
    return ftr < 2;
  }

  static isSegundaLinhaEE(ftr: number): boolean {
    return ftr === 2;
  }

  static isTerceiraLinhaEE(ftr: number): boolean {
    return ftr > 2;
  }

  private static calculaSEeCE(derValor: number, ftrValor: number) {
    if (derValor < 6) {
      return this.calcularSEeCEPorIntervaloFTR(ftrValor,
        Complexidade.BAIXA, Complexidade.BAIXA, Complexidade.MEDIA);
    } else if (derValor >= 6 && derValor <= 19) {
      return this.calcularSEeCEPorIntervaloFTR(ftrValor,
        Complexidade.BAIXA, Complexidade.MEDIA, Complexidade.ALTA);
    } else if (derValor > 19) {
      return this.calcularSEeCEPorIntervaloFTR(ftrValor,
        Complexidade.MEDIA, Complexidade.ALTA, Complexidade.ALTA);
    }
  }

  private static calcularSEeCEPorIntervaloFTR(ftrValor: number,
    c1: Complexidade, c2: Complexidade, c3: Complexidade) {

    if (ftrValor < 2) {
      return c1;
    } else if (ftrValor === 2 || ftrValor === 3) {
      return c2;
    } else if (ftrValor > 3) {
      return c3;
    }
  }
}
