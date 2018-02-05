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
      return { label: label, value: fa.fator };
    });
  }

  private generateLabel(fa: FatorAjuste): string {
    const prefix = this.generatePrefix(fa);
    const fatorSuffix = this.generateFatorSuffix(fa);
    return `${prefix} ${fa.nome} - ${fa.fator}${fatorSuffix}`;
  }

  private generatePrefix(fa: FatorAjuste): string {
    let prefix = '';
    if (fa.codigo) {
      prefix = prefix.concat(`${fa.codigo} `);
    }
    if (fa.origem) {
      prefix = prefix.concat(`(${fa.origem}) `);
    }
    if (!this.isEmptyString(prefix)) {
      prefix = prefix.concat('- ');
    }
    return prefix;
  }

  private isEmptyString(s: string) {
    return (!s || 0 === s.length);
  }

  private generateFatorSuffix(fa: FatorAjuste): string {
    if (fa.tipoAjuste === 'PERCENTUAL') {
      return '%';
    } else if (fa.tipoAjuste === 'UNITARIO') {
      return ' PF';
    }
  }

}
