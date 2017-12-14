import { BaseEntity } from '../shared';


export class Alr implements BaseEntity {

  constructor(
    public id?: number,
    public funcaoTransacao?: BaseEntity,
    public funcaoDados?: BaseEntity[],
  ) {}
}
