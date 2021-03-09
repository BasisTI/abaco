import { BaseEntity } from '../shared';
import { TipoEquipe } from '../tipo-equipe';
import { Organizacao } from '../organizacao';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserService } from './user.service';
import { Perfil } from '../perfil/perfil.model';


export class User implements BaseEntity {

  constructor(
    public id?: number,
    public login?: string,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public activated?: boolean,
    public imageUrl?: string,
    public tipoEquipes?: TipoEquipe[],
    public perfils?: Perfil[],
    public organizacoes?: Organizacao[]
  ) { }


  // Não funcionando na busca pois dataTableService retorna um Object e não um User
  get nome(): string {
    return this.firstName + ' ' + this.lastName;
  }

  set nome(fullName: string) {
    this.nome = fullName;
  }

  get name(): string {
    return this.firstName + ' ' + this.lastName;
  }

  set name(fullName: string) {
    this.name = fullName;
  }

  get roles(): string[] {
    return this.perfils.map(a => a.nome);
  }

  set roles(roles: string[]) {
    this.perfils = roles.map(r => new Perfil());
  }

  toJSONState() {
    return Object.assign({}, this);
  }
  copyFromJSON(json: any) {
    const user = new User(
       json.id,
       json.login,
       json.firstName,
       json.lastName);
    return user
  }

}

export class SearchGroup{
  constructor(
    public nome?: string,
    public login?: string,
    public email?: string,
    public organizacao?:any[],
    public perfil?:any[],
    public tipoEquipe?:any[],
    public columnsVisible?: any,
) {
}
}
