import { BaseEntity } from '../shared';


export class Organizacao implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public cnpj?: string,
    public ativo?: boolean,
    public numeroOcorrencia?: string,
    public contrato?: BaseEntity,
    public sistemas?: BaseEntity[],
  ) {}
}
