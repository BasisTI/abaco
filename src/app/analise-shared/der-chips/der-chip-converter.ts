import { DerChipItem } from './der-chip-item';
import { Der } from '../../der/der.model';

export class DerChipConverter {

  static desconverterEmDers(chips: DerChipItem[]): Der[] {
    const ders: Der[] = [];
    chips.forEach(chipItem => {
      const der = new Der();
      der.id = chipItem.id;

      if (!isNaN(chipItem.text as any)) {
        der.valor = Number(chipItem.text);
      } else {
        der.nome = chipItem.text;
      }

      ders.push(der);
    });
    return ders;
  }


  static converterDers(ders: Der[]): DerChipItem[] {
    return ders.map(der => new DerChipItem(der.id, this.retrieveTextFromDER(der)));
  }

  private static retrieveTextFromDER(der: Der): string {
    return der.valor ? der.valor.toString() : der.nome;
  }

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

  // TODO pode ser um outro tipo não any?
  static valor(items: any[]): number {
    if (items.length === 1 && items[0].valor) {
      return items[0].valor;
    } else {
      return items.length;
    }
  }

}
