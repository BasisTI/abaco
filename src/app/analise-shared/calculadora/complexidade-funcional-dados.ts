import { Complexidade } from '../complexidade-enum';
import { ComplexidadeFuncionalALIeAIE } from './complexidade-funcional';

export class ComplexidadeFuncionalDados {

  static calcular(derValor: number, rlrValor: number): Complexidade {
    return new ComplexidadeFuncionalALIeAIE(derValor, rlrValor).calcular();
  }

}
