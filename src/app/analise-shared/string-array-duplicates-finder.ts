export class DuplicatesResult {

  readonly duplicados: String[];

  constructor(duplicados: String[]) {
    this.duplicados = duplicados;
  }

  temDuplicatas(): boolean {
    if (!this.duplicados) {
      return false;
    }
    return this.duplicados.length > 0;
  }

}

export class StringArrayDuplicatesFinder {

  static find(valores: String[]): DuplicatesResult {
    
  }

}
