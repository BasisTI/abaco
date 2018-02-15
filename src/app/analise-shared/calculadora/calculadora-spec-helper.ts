import { FatorAjuste } from '../../fator-ajuste/index';
import { Complexidade } from '../complexidade-enum';
import { FatorAjusteLabelGenerator } from '../../shared/fator-ajuste-label-generator';

export class CalculadoraSpecHelper {

  fatorAjuste: FatorAjuste;
  pfBruto: number;
  pfLiquido: number;
  complexidade: Complexidade;

  constructor() { }

  setFatorAjuste(fa: FatorAjuste): CalculadoraSpecHelper {
    this.fatorAjuste = fa;
    return this;
  }

  setPfBruto(pfB: number): CalculadoraSpecHelper {
    this.pfBruto = pfB;
    return this;
  }

  setPfLiquido(pfL: number): CalculadoraSpecHelper {
    this.pfLiquido = pfL;
    return this;
  }

  setComplexidade(c: Complexidade): CalculadoraSpecHelper {
    this.complexidade = c;
    return this;
  }

  get fatorAjusteLabel(): string {
    return FatorAjusteLabelGenerator.generate(this.fatorAjuste);
  }

}
