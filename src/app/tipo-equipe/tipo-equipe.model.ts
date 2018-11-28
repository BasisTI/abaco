import { BaseEntity } from '../shared';
import {User} from '../user';


export class TipoEquipe implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public nomeOrg?: string,
    public organizacoes?: BaseEntity[]
  ) {}
}
