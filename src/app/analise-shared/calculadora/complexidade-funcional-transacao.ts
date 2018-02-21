import { TipoFuncaoTransacao } from '../../funcao-transacao/funcao-transacao.model';
import { Complexidade } from '../complexidade-enum';
import { ComplexidadeFuncionalEE, ComplexidadeFuncionalSEeCE } from './complexidade-funcional';

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
