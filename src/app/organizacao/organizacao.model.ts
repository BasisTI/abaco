import { BaseEntity } from '../shared';


export class Organizacao implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public cnpj?: string,
    public ativo?: boolean,
    public numeroOcorrencia?: string,
    public contratos?: BaseEntity[],
    public sistemas?: BaseEntity[],
  ) {}

  addContrato(contrato: BaseEntity) {
    if(!this.contratos)
      this.contratos = [];
    this.contratos.push(contrato);
  }

}
