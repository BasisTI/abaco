import { Complexidade } from '../complexidade-enum';
import { ComplexidadeFuncionalEE, ComplexidadeFuncionalSEeCE } from './complexidade-funcional';
import { TipoFuncaoTransacao } from 'src/app/funcao-transacao';

export class ComplexidadeFuncionalTransacao {

  static calcular(tipo: TipoFuncaoTransacao,
    derValor: number, ftrValor: number): Complexidade {

    if (tipo === TipoFuncaoTransacao.EE) {
      return new ComplexidadeFuncionalEE(derValor, ftrValor).calcular();
    } else {
      return new ComplexidadeFuncionalSEeCE(derValor, ftrValor).calcular();
    }
  }

}
