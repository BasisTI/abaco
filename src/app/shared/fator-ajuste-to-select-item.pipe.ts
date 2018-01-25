import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { FatorAjuste } from '../fator-ajuste';

@Pipe({ name: 'fatorAjusteToSelectItem' })
export class FatorAjusteToSelectItemPipe implements PipeTransform {

  public transform(fatoresAjuste: FatorAjuste[]): SelectItem[] {
    if (!fatoresAjuste) {
      return undefined;
    }

    return fatoresAjuste.map(fa => {
      const label = `${fa.nome} - ${fa.tipoAjuste} - ${fa.fator}`;
      return { label: label, value: fa };
    });
  }

}
