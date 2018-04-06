import { BaseEntity } from '../shared';


export class TipoEquipe implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public organizacoes?: BaseEntity[]
  ) {}
}
