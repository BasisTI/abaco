import { BaseEntity } from '../shared';


export class TipoFase implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
  ) {}
}
