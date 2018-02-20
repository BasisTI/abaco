import { Complexidade } from '../complexidade-enum';

export class ComplexidadeFuncionalDados {

  static calcular(derValor: number, rlrValor: number): Complexidade {
    if (this.isPrimeiraColuna(derValor)) {
      return this.calcularPorIntervaloRLR(rlrValor,
        Complexidade.BAIXA, Complexidade.BAIXA, Complexidade.MEDIA);
    } else if (this.isSegundaColuna(derValor)) {
      return this.calcularPorIntervaloRLR(rlrValor,
        Complexidade.BAIXA, Complexidade.MEDIA, Complexidade.ALTA);
    } else if (this.isTerceiraColuna(derValor)) {
      return this.calcularPorIntervaloRLR(rlrValor,
        Complexidade.MEDIA, Complexidade.ALTA, Complexidade.ALTA);
    }
  }

  static isPrimeiraColuna(der: number): boolean {
    return der < 20;
  }

  static isSegundaColuna(der: number): boolean {
    return der >= 20 && der <= 50;
  }

  static isTerceiraColuna(der: number): boolean {
    return der > 50;
  }

  private static calcularPorIntervaloRLR(rlrValor: number, complexidade1: Complexidade,
    complexidade2: Complexidade, complexidade3: Complexidade) {
    if (this.isPrimeiraLinha(rlrValor)) {
      return complexidade1;
    } else if (this.isSegundaLinha(rlrValor)) {
      return complexidade2;
    } else if (this.isTerceiraLinha(rlrValor)) {
      return complexidade3;
    }
  }

  static isPrimeiraLinha(rlr: number) {
    return rlr === 1;
  }

  static isSegundaLinha(rlr: number) {
    return rlr >= 2 && rlr <= 5;
  }

  static isTerceiraLinha(rlr: number) {
    return rlr > 5;
  }

}
