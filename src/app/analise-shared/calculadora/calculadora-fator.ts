import { FatorAjuste } from '../../fator-ajuste/fator-ajuste.model';

export class CalculadoraFator {


  public static aplicarFator(pf: number, fatorAjuste: FatorAjuste): number {
    if (fatorAjuste.isPercentual()) {
      return pf * fatorAjuste.fator;
    } else { // UNITÁRIO
      return fatorAjuste.fator;
    }
  }

}
