import { DerChipItem } from './der-chip-item';

export class DerChipConverter {

  // TODO quando for somente o número?
  static converter(valores: string[]): DerChipItem[] {
    if (valores) {
      return this.doConverter(valores);
    }
  }

  private static doConverter(valores: string[]): DerChipItem[] {
    return valores.map(val => {
      return new DerChipItem(undefined, val);
    });
  }

}
