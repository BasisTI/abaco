import { BaseEntity } from '../shared';

export class Nomenclatura implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public descricao?: string,
  ) {}
}
export class SearchGroup {

  constructor(
      public nome?: string,
  ) {
  }
}