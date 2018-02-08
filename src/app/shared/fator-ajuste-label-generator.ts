import { FatorAjuste, TipoFatorAjuste } from '../fator-ajuste';

export class FatorAjusteLabelGenerator {

  private static _fatorAjuste: FatorAjuste;

  private static _label: string;

  static generate(fatorAjuste: FatorAjuste): string {
    this._fatorAjuste = fatorAjuste;
    this.doGenerate();
    return this._label;
  }

  private static doGenerate() {
    const fa: FatorAjuste = this._fatorAjuste;
    const prefix = this.generatePrefix();
    const fatorSuffix = this.generateFatorSuffix();
    this._label = `${prefix} ${fa.nome} - ${fa.fatorVisualizavel()}${fatorSuffix}`;
  }

  private static generatePrefix(): string {
    const fa: FatorAjuste = this._fatorAjuste;
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

  private static isEmptyString(s: string) {
    return (!s || 0 === s.length);
  }

  private static generateFatorSuffix(): string {
    if (this._fatorAjuste.isPercentual()) {
      return '%';
    } else if (this._fatorAjuste.isUnitario()) {
      return ' PF';
    }
  }



}
