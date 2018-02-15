import { Complexidade } from '../complexidade-enum';

export class ComplexidadeFuncionalDados {

  static calcular(derValor: number, rlrValor: number): Complexidade {
    if (derValor < 20) {
      return this.calcularPorIntervaloRLR(rlrValor,
        Complexidade.BAIXA, Complexidade.BAIXA, Complexidade.MEDIA);
    } else if (derValor >= 20 && derValor <= 50) {
      return this.calcularPorIntervaloRLR(rlrValor,
        Complexidade.BAIXA, Complexidade.MEDIA, Complexidade.ALTA);
    } else if (derValor > 50) {
      return this.calcularPorIntervaloRLR(rlrValor,
        Complexidade.MEDIA, Complexidade.ALTA, Complexidade.ALTA);
    }
  }

  private static calcularPorIntervaloRLR(rlrValor: number, complexidade1: Complexidade,
    complexidade2: Complexidade, complexidade3: Complexidade) {
    if (rlrValor === 1) {
      return complexidade1;
    } else if (rlrValor >= 2 && rlrValor <= 5) {
      return complexidade2;
    } else if (rlrValor > 5) {
      return complexidade3;
    }
  }

}
