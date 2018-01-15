import { BaseEntity } from '../shared';
import { User as BasisUser } from '@basis/angular-components';


export class User implements BaseEntity, BasisUser {

  constructor(
    public id?: number,
    public login?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public activated?: boolean,
    public imageUrl?: string,
    public tipoEquipes?: BaseEntity[],
    public authorities?: string[],
    public organizacoes?: BaseEntity[],
    public ativo?: boolean,
  ) { }


  // Não funcionando na busca pois dataTableService retorna um Object e não um User
  get nome(): string {
    return this.firstName + ' ' + this.lastName;
  }

  get roles(): string[] {
    return this.authorities;
  }

  set roles(roles: string[]) {
    this.authorities = roles;
  }

}
