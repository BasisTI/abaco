import { BaseEntity, MappableEntities, JSONable } from '../shared';
import { Contrato } from '../contrato';

export class Organizacao implements BaseEntity, JSONable<Organizacao> {

  private mappableContracts: MappableEntities<Contrato>;

  constructor(
    public id?: number,
    public sigla?: string,
    public nome?: string,
    public cnpj?: string,
    public logoId?: number,
    public ativo?: boolean,
    public numeroOcorrencia?: string,
    public contracts?: Contrato[],
    // FIXME BaseEntity, para evitar dependencias circulares
    // parece que reestruturação de pastas evita isso
    public sistemas?: BaseEntity[],
  ) {
    if (contracts) {
      this.mappableContracts = new MappableEntities<Contrato>(contracts);
    } else {
      this.contracts = [];
      this.mappableContracts = new MappableEntities<Contrato>();
    }
  }

  toJSONState(): Organizacao {
    const copy: Organizacao = Object.assign({}, this);
    return copy;
  }

  copyFromJSON(json: any) {
    const contratos: Contrato[] = json.contracts.map(c => new Contrato().copyFromJSON(c));
    const newOrganizacao = new Organizacao(json.id, json.sigla, json.nome,
      json.cnpj, json.logoId, json.ativo, json.numeroOcorrencia, contratos, json.sistemas);
    return newOrganizacao;
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
