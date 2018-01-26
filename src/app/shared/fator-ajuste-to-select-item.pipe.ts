import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { FatorAjuste, TipoFatorAjuste } from '../fator-ajuste';

@Pipe({ name: 'fatorAjusteToSelectItem' })
export class FatorAjusteToSelectItemPipe implements PipeTransform {

  public transform(fatoresAjuste: FatorAjuste[]): SelectItem[] {
    if (!fatoresAjuste) {
      return undefined;
    }

    return fatoresAjuste.map(fa => {
      const label = this.generateLabel(fa);
      return { label: label, value: fa };
    });
  }

  private generateLabel(fatorAjuste: FatorAjuste) {
    if (fatorAjuste.tipoAjuste === 'PERCENTUAL') {
      return this.generateLabelPercentual(fatorAjuste);
    } else if (fatorAjuste.tipoAjuste === 'UNITARIO') {
      return this.generateLabelUnitario(fatorAjuste);
    }
    return fatorAjuste.nome;
  }

  private generateLabelPercentual(fa: FatorAjuste) {
    const cod = fa.codigo;
    const orig = fa.origem;
    const label = `${fa.codigo} (${fa.origem}) - ${fa.nome} - ${fa.fator}%`;
    return label;
  }

  private generateLabelUnitario(fa: FatorAjuste) {
    const cod = fa.codigo;
    const orig = fa.origem;
    const label = `${fa.codigo} (${fa.origem}) - ${fa.nome} - ${fa.fator} PF`;
    return label;
  }

}
