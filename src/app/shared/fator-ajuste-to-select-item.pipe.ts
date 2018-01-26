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

  private generateLabel(fa: FatorAjuste): string {
    const fatorSuffix = this.generateFatorSuffix(fa);
    return `${fa.codigo} (${fa.origem}) - ${fa.nome} - ${fa.fator}${fatorSuffix}`;
  }

  private generateFatorSuffix(fa: FatorAjuste): string {
    if (fa.tipoAjuste === 'PERCENTUAL') {
      return '%';
    } else if (fa.tipoAjuste === 'UNITARIO') {
      return ' PF';
    }
  }

}
