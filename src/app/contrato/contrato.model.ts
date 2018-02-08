import { BaseEntity, JSONable } from '../shared';
import { Manual } from '../manual';

export class Contrato implements BaseEntity, JSONable<Contrato> {

  constructor(
    public id?: number,
    public numeroContrato?: string,
    public dataInicioVigencia?: Date,
    public dataFimVigencia?: Date,
    public manual?: Manual,
    public ativo?: boolean,
    public artificialId?: number,
  ) { }

  toJSONState(): Contrato {
    const copy: Contrato = Object.assign({}, this);
    return copy;
  }

  copyFromJSON(json: any) {
    const manual = new Manual().copyFromJSON(json.manual);
    return new Contrato(json.id, json.numeroContrato, new Date(json.dataInicioVigencia),
      new Date(json.dataFimVigencia), manual, json.ativo);
  }

  // TODO extrair modulo? entrar pro jsonable?
  clone(): Contrato {
    return new Contrato(this.id, this.numeroContrato, this.dataInicioVigencia,
      this.dataFimVigencia, this.manual, this.ativo, this.artificialId);
  }
}
