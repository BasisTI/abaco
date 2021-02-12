import * as _ from 'lodash';

export class DuplicatesResult {

  readonly duplicados: Set<string>;

  constructor(duplicados: Set<string>) {
    this.duplicados = duplicados;
  }

  temDuplicatas(): boolean {
    if (!this.duplicados) {
      return false;
    }
    return this.duplicados.size > 0;
  }

  count(): number {
    return this.duplicados.size;
  }

  length(): number {
    return this.count();
  }

  duplicatasFormatadas(): string {
    return _.join(Array.from(this.duplicados), ', ');
  }

}

export class StringArrayDuplicatesFinder {

  static find(valores: string[]): DuplicatesResult {
    const valoresSet: Set<string> = new Set<string>();
    const duplicados: Set<string> = new Set<string>();
    if (valores) {
      valores.forEach(val => {
        if (!valoresSet.has(val)) {
          valoresSet.add(val);
        } else {
          duplicados.add(val);
        }
      });
    }
    return new DuplicatesResult(duplicados);
  }

}
