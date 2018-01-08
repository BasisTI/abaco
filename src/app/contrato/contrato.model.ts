import { BaseEntity } from '../shared';


export class Contrato implements BaseEntity {

  // TODO avaliar se consegue funcionar sem artificialId

  constructor(
    public id?: number,
    public numeroContrato?: string,
    public dataInicioVigencia?: any,
    public dataFimVigencia?: any,
    public manual?: BaseEntity,
    public ativo?: boolean,
  ) { }

  clone(): Contrato {
    return new Contrato(this.id, this.numeroContrato, this.dataInicioVigencia,
      this.dataFimVigencia, this.manual, this.ativo);
  }
}
