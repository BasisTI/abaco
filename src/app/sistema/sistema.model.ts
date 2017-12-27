import { BaseEntity } from '../shared';


export class Sistema implements BaseEntity {

  constructor(
    public id?: number,
    public sigla?: string,
    public nome?: string,
    public numeroOcorrencia?: string,
    public organizacao?: BaseEntity,
    public modulos?: BaseEntity[],
  ) {}

  addModulo(modulo: BaseEntity) {
    if(!this.modulos)
      this.modulos = [];
    this.modulos.push(modulo);
  }
}
