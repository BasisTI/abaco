import { Complexidade } from '../complexidade-enum';
import { ComplexidadeFuncionalALIeAIE } from './complexidade-funcional';

export class ComplexidadeFuncionalDados {

  static calcular(derValor: number, rlrValor: number): Complexidade {
    return new ComplexidadeFuncionalALIeAIE(derValor, rlrValor).calcular();
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
