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
  static valor(ders: Der[]): number {
    if (!ders) {
      return 0;
    } else if (ders.length === 1 && ders[0].valor) {
      return ders[0].valor;
    } else {
      return ders.length;
    }
  }

}
