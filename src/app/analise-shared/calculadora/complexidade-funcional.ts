import { Complexidade } from '../../analise-shared/complexidade-enum';

export abstract class ComplexidadeFuncional {

  readonly der: number;
  readonly nonDer: number;

  constructor(der: number, nonDer: number) {
    this.der = der;
    this.nonDer = nonDer;
  }

  calcular(): Complexidade {
    if (this.isBaixaComplexidade()) {
      return Complexidade.BAIXA;
    } else if (this.isMediaComplexidade()) {
      return Complexidade.MEDIA;
    } else if (this.isAltaComplexidade()) {
      return Complexidade.ALTA;
    }
  }

  isBaixaComplexidade(): boolean {
    return this.isPrimeiraColuna() && (this.isPrimeiraLinha() || this.isSegundaLinha()) ||
      this.isSegundaColuna() && this.isPrimeiraLinha();
  }

  isMediaComplexidade(): boolean {
    return this.isPrimeiraColuna() && this.isTerceiraLinha() ||
      this.isSegundaColuna() && this.isSegundaLinha() ||
      this.isTerceiraColuna() && this.isPrimeiraLinha();
  }

  isAltaComplexidade(): boolean {
    return this.isSegundaColuna() && this.isTerceiraLinha() ||
      this.isTerceiraColuna() && (this.isSegundaLinha() || this.isTerceiraLinha());
  }

  abstract isPrimeiraColuna(): boolean;
  abstract isSegundaColuna(): boolean;
  abstract isTerceiraColuna(): boolean;

  abstract isPrimeiraLinha(): boolean;
  abstract isSegundaLinha(): boolean;
  abstract isTerceiraLinha(): boolean;

}

export class ComplexidadeFuncionalDados extends ComplexidadeFuncional {

  isPrimeiraColuna(): boolean {
    return this.der < 20;
  }

  isSegundaColuna(): boolean {
    return this.der >= 20 && this.der <= 50;
  }

  isTerceiraColuna(): boolean {
    return this.der > 50;
  }

  isPrimeiraLinha(): boolean {
    return this.nonDer === 1;
  }

  isSegundaLinha(): boolean {
    return this.nonDer >= 2 && this.nonDer <= 5;
  }

  isTerceiraLinha(): boolean {
    return this.nonDer > 5;
  }
}

export class ComplexidadeFuncionalEE extends ComplexidadeFuncional {

  isPrimeiraColuna(): boolean {
    return this.der < 5;
  }

  isSegundaColuna(): boolean {
    return this.der >= 5 && this.der <= 15;
  }

  isTerceiraColuna(): boolean {
    return this.der > 15;
  }

  isPrimeiraLinha(): boolean {
    return this.nonDer < 2;
  }

  isSegundaLinha(): boolean {
    return this.nonDer === 2;
  }

  isTerceiraLinha(): boolean {
    return this.nonDer > 2;
  }

}

export class ComplexidadeFuncionalSEeCE extends ComplexidadeFuncional {

  isPrimeiraColuna(): boolean {
    return this.der < 6;
  }

  isSegundaColuna(): boolean {
    return this.der >= 6 && this.der <= 19;
  }

  isTerceiraColuna(): boolean {
    return this.der > 19;
  }

  isPrimeiraLinha(): boolean {
    return this.nonDer < 2;
  }

  isSegundaLinha(): boolean {
    return this.nonDer === 2 || this.nonDer === 3;
  }

  isTerceiraLinha(): boolean {
    return this.nonDer > 3;
  }
}

