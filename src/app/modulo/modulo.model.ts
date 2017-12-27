import { BaseEntity } from '../shared';


export class Modulo implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public sistema?: BaseEntity,
    public funcionalidades?: BaseEntity[],
  ) {}
}
