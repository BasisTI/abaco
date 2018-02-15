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
