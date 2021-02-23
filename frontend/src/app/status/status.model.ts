import { BaseEntity } from '../shared';

export class Status implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public ativo?: boolean,
    public divergencia?: boolean,
  ) {}
}

export class SearchGroup {

  constructor(
      public nome?: string,
  ) {
  }
}
