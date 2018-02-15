import { Complexidade } from '../complexidade-enum';

export class ComplexidadeFuncionalDados {

  static calcular(derValor: number, rlrValor: number): Complexidade {
    if (derValor < 20) {
      if (rlrValor === 1) {
        return Complexidade.BAIXA;
      } else if (rlrValor >= 2 && rlrValor <= 5) {
        return Complexidade.BAIXA;
      } else if (rlrValor >= 6) {
        return Complexidade.MEDIA;
      }
    }
  }

}
