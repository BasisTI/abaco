import {FatorAjuste} from '../../fator-ajuste/fator-ajuste.model';

export class CalculadoraFator {


    public static aplicarFator(pf: number, fatorAjuste: FatorAjuste, quantidade: number): number {

        if (fatorAjuste.isPercentual()) {
            return pf * fatorAjuste.fator;
        } else { // UNITÁRIO

            const retorno: number = (quantidade === undefined || quantidade === 0 ) ? fatorAjuste.fator : fatorAjuste.fator * quantidade;
            return retorno;
        }
    }

}
