import { BaseEntity } from '../shared';
import { User as BasisUser } from '@basis/angular-components';
import { Authority } from './authority.model';
import {TipoEquipe} from '../tipo-equipe';
import {Organizacao} from '../organizacao';


export class User implements BaseEntity, BasisUser {

  constructor(
    public id?: number,
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public activated?: boolean,
    public imageUrl?: string,
    public tipoEquipe?: TipoEquipe,
    public authorities?: Authority[],
    public organizacoes?: Organizacao[]
  ) { }


  // Não funcionando na busca pois dataTableService retorna um Object e não um User
  get nome(): string {
    return this.firstName + ' ' + this.lastName;
  }

  get roles(): string[] {
    return this.authorities.map(a => a.name);
  }

  set roles(roles: string[]) {
    this.authorities = roles.map(r => new Authority(r));
  }

}
