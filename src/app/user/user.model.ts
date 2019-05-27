import { BaseEntity } from '../shared';
import { User as BasisUser } from '@basis/angular-components';
import { Authority } from './authority.model';
import { TipoEquipe } from '../tipo-equipe';
import { Organizacao } from '../organizacao';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserService } from './user.service';


export class User implements BaseEntity, BasisUser {

  constructor(
    public id?: number,
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public activated?: boolean,
    public imageUrl?: string,
    public tipoEquipes?: TipoEquipe[],
    public authorities?: Authority[],
    public organizacoes?: Organizacao[]
  ) { }


  // Não funcionando na busca pois dataTableService retorna um Object e não um User
  get nome(): string {
    return this.firstName + ' ' + this.lastName;
  }

  set nome(fullName: string) {
    this.nome = fullName;
  }

  get roles(): string[] {
    return this.authorities.map(a => a.name);
  }

  set roles(roles: string[]) {
    this.authorities = roles.map(r => new Authority(r));
  }

  toJSONState() {
    return Object.assign({}, this);
  }

}