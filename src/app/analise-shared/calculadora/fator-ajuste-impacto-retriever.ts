import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/fator-ajuste.model';
import { Manual } from '../../manual/manual.model';

export class FatorAjusteImpactoRetriever {

  static retrieve(fatorAjuste: FatorAjuste, impacto: string, manual: Manual): FatorAjuste {
    if (fatorAjuste) {
      return fatorAjuste;
    } else {
      return this.generateFatorAjusteFromImpacto(impacto, manual);
    }
  }

  private static generateFatorAjusteFromImpacto(impacto: string, manual: Manual): FatorAjuste {
    const fatorAjuste: FatorAjuste = new FatorAjuste();
    fatorAjuste.fator = this.retrieveFator(impacto, manual);
    fatorAjuste.tipoAjuste = TipoFatorAjuste.PERCENTUAL;
    return fatorAjuste;
  }

  private static retrieveFator(impacto: string, manual: Manual): number {
    switch (impacto) {
      case 'Inclusão':
        return manual.parametroInclusao;
      case 'Alteração':
        return manual.parametroAlteracao;
      case 'Exclusão':
        return manual.parametroExclusao;
      case 'Inclusão':
        return manual.parametroConversao;
    }
  }

}
