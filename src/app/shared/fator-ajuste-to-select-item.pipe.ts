import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { FatorAjuste, TipoFatorAjuste } from '../fator-ajuste';
import { FatorAjusteLabelGenerator } from './fator-ajuste-label-generator';

@Pipe({ name: 'fatorAjusteToSelectItem' })
export class FatorAjusteToSelectItemPipe implements PipeTransform {

  public transform(fatoresAjuste: FatorAjuste[]): SelectItem[] {
    if (!fatoresAjuste) {
      return undefined;
    }

    return fatoresAjuste.map(fa => {
      const label = FatorAjusteLabelGenerator.generate(fa);
      return { label: label, value: fa };
    });
  }
}
