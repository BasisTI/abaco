import { FatorAjuste } from '../../fator-ajuste/index';
import { Complexidade } from '../complexidade-enum';
import { FatorAjusteLabelGenerator } from '../../shared/fator-ajuste-label-generator';

export class CalculadoraSpecHelper {

  constructor(
    public fatorAjuste: FatorAjuste,
    public pfBruto: number,
    public pfLiquido: number,
    public complexidade: Complexidade
  ) { }

  get fatorAjusteLabel(): string {
    return FatorAjusteLabelGenerator.generate(this.fatorAjuste);
  }

}
