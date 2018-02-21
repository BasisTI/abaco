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

  static isPrimeiraColunaEE(der: number): boolean {
    return der < 5;
  }

  static isSegundaColunaEE(der: number): boolean {
    return der >= 5 && der <= 15;
  }

  static isTerceiraColunaEE(der: number): boolean {
    return der > 15;
  }

  static isPrimeiraLinhaEE(ftr: number): boolean {
    return ftr < 2;
  }

  static isSegundaLinhaEE(ftr: number): boolean {
    return ftr === 2;
  }

  static isTerceiraLinhaEE(ftr: number): boolean {
    return ftr > 2;
  }

  static isPrimeiraColunaSEeCE(der: number): boolean {
    return der < 6;
  }

  static isSegundaColunaSEeCE(der: number): boolean {
    return der >= 6 && der <= 19;
  }

  static isTerceiraColunaSEeCE(der: number): boolean {
    return der > 19;
  }

  static isPrimeiraLinhaSEeCE(ftr: number): boolean {
    return ftr < 2;
  }

  static isSegundaLinhaSEeCE(ftr: number): boolean {
    return ftr === 2 || ftr === 3;
  }

  static isTerceiraLinhaSEeCE(ftr: number): boolean {
    return ftr > 3;
  }

}
