import {FatorAjuste} from '../../fator-ajuste/fator-ajuste.model';

export class CalculadoraFator {


    public static aplicarFator(pf: number, fatorAjuste: FatorAjuste, quantidade: number): number {

        if (fatorAjuste.isPercentual()) {
            return pf * fatorAjuste.fator;
        } else { // UNITÁRIO

            const retorno: number = (quantidade === undefined) ? fatorAjuste.fator : fatorAjuste.fator * quantidade;
            return retorno;
        }
    }

}
