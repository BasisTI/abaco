import { BaseEntity } from '../shared';


export class User implements BaseEntity {

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
  ) {}


  // Não funcionando na busca pois dataTableService retorna um Object e não um User
  get nome(): string {
    return this.firstName + " " + this.lastName;
  }

}
