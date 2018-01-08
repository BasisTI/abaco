import { BaseEntity, MappableEntities } from '../shared';
import { Contrato } from '../contrato';

export class Organizacao implements BaseEntity {

  private mappableContracts: MappableEntities<Contrato>;

  constructor(
    public id?: number,
    public sigla?: string,
    public nome?: string,
    public cnpj?: string,
    public ativo?: boolean,
    public numeroOcorrencia?: string,
    public contracts?: Contrato[],
    public sistemas?: BaseEntity[],
  ) {
    if (contracts) {
      this.mappableContracts = new MappableEntities<Contrato>(contracts);
    } else {
      this.contracts = [];
      this.mappableContracts = new MappableEntities<Contrato>();
    }
  }

  addContrato(contrato: Contrato) {
    this.mappableContracts.push(contrato);
    this.contracts = this.mappableContracts.values();
  }

  updateContrato(contrato: Contrato) {
    this.mappableContracts.update(contrato);
    this.contracts = this.mappableContracts.values();
  }

  deleteContrato(contrato: Contrato) {
    this.mappableContracts.delete(contrato);
    this.contracts = this.mappableContracts.values();
  }

}
