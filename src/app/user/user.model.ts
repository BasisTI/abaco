import { BaseEntity } from '../shared';


export class User implements BaseEntity {

  constructor(
    public id?: number,
    public names?: BaseEntity[],
  ) {}
}
