import { User } from './../user/user.model';
import { BaseEntity } from '../shared';


export class TipoEquipe implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public nomeOrg?: string,
    public cfpsResponsavel?: User,
    public organizacoes?: BaseEntity[],
    public preposto?: string,
    public emailPreposto?: string,

  ) {}
}

export class SearchGroup {

  constructor(
      public nome?: string,
  ) {
  }
}
