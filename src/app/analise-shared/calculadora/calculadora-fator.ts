import {FatorAjuste} from '../../fator-ajuste/fator-ajuste.model';

export class CalculadoraFator {

    /**
     * Função para aplicar o fator de ajuste sobre o calculo de pontos de função de dados e de transação
     * @param pf Pontos de Função contados
     * @param fatorAjuste Fator para ajustar os pontos de função. Quando passado como valor percentual, deve vir no intervalo [0-100]
     * @param quantidade Quantidade a ser aplicada sobre o fator de ajuste unitário apenas
     */
    public static aplicarFator(pf: number, fatorAjuste: FatorAjuste, quantidade: number): number {

        if (fatorAjuste.isPercentual()) {
            return (pf * fatorAjuste.fator) / 100;
        } else { // UNITÁRIO
            return fatorAjuste.fator * quantidade;
        }
    }

}
