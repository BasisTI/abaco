import { FatorAjuste, TipoFatorAjuste, ImpactoFatorAjuste } from '../../fator-ajuste/fator-ajuste.model';
import { Manual } from '../../manual/manual.model';

export class FatorAjusteImpactoRetriever {

  /**
   *
   * @param fatorAjuste
   * @param impacto
   * @param manual
   */
  static retrieve(fatorAjuste: FatorAjuste, impacto: string, manual: Manual): FatorAjuste {
    if (fatorAjuste) {
      return fatorAjuste;
    } else {
      return this.generateFatorAjusteFromImpacto(impacto, manual);
    }
  }

  /**
   *
   * @param impacto
   * @param manual
   */
  private static generateFatorAjusteFromImpacto(impacto: string, manual: Manual): FatorAjuste {
    const fatorAjuste: FatorAjuste = new FatorAjuste();
    fatorAjuste.fator = this.retrieveFator(impacto, manual);
    fatorAjuste.tipoAjuste = TipoFatorAjuste.PERCENTUAL;
    return fatorAjuste;
  }

  /**
   *
   * @param impacto
   * @param manual
   */
  private static retrieveFator(impacto: string, manual: Manual): number {
    switch (impacto) {
      case ImpactoFatorAjuste.INCLUSAO:
        return manual.parametroInclusao;
      case ImpactoFatorAjuste.ALTERACAO:
        return manual.parametroAlteracao;
      case ImpactoFatorAjuste.EXCLUSAO:
        return manual.parametroExclusao;
      case ImpactoFatorAjuste.CONVERSAO:
        return manual.parametroConversao;
    }
  }

}
