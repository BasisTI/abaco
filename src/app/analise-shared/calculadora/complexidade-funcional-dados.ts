import { Complexidade } from '../complexidade-enum';

export class ComplexidadeFuncionalDados {

  static calcular(derValor: number, rlrValor: number): Complexidade {
    if (derValor < 20) {
      return this.calcularPorIntervaloRLR(rlrValor,
         Complexidade.BAIXA, Complexidade.BAIXA, Complexidade.MEDIA);
    }
  }

  private static calcularPorIntervaloRLR(rlrValor: number, complexidade1: Complexidade,
    complexidade2: Complexidade, complexidade3: Complexidade) {
      if (rlrValor === 1) {
        return complexidade1;
      } else if (rlrValor >= 2 && rlrValor <= 5) {
        return complexidade2;
      } else if (rlrValor >= 6) {
        return complexidade3;
      }
  }

}
