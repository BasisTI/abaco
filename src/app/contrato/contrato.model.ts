import { BaseEntity } from '../shared';


export class Contrato implements BaseEntity {

  constructor(
    public id?: number,
    public numeroContrato?: string,
    public dataInicioVigencia?: any,
    public dataFimVigencia?: any,
    public manual?: BaseEntity,
  ) {}
}
