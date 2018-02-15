import { TipoFuncaoTransacao } from '../../funcao-transacao/funcao-transacao.model';
import { Complexidade } from '../complexidade-enum';

export class ComplexidadeFuncionalTransacao {

  static calcular(tipo: TipoFuncaoTransacao,
    derValor: number, ftrValor: number): Complexidade {

    if (tipo === TipoFuncaoTransacao.EE) {
      if (derValor < 5) {
        return this.calcularEEPorIntervaloFTR(ftrValor,
          Complexidade.BAIXA, Complexidade.BAIXA, Complexidade.MEDIA);
      } else if (derValor >= 5 && derValor <= 15) {
        return this.calcularEEPorIntervaloFTR(ftrValor,
          Complexidade.BAIXA, Complexidade.MEDIA, Complexidade.ALTA);
      } else if (derValor > 15) {
        return this.calcularEEPorIntervaloFTR(ftrValor,
          Complexidade.MEDIA, Complexidade.ALTA, Complexidade.ALTA);
      }
    }
  }

  private static calcularEEPorIntervaloFTR(ftrValor: number,
    c1: Complexidade, c2: Complexidade, c3: Complexidade) {

    if (ftrValor < 2) {
      return c1;
    } else if (ftrValor === 2) {
      return c2;
    } else if (ftrValor > 2) {
      return c3;
    }
  }
}
