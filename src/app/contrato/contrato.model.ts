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
    public diasDeGarantia?: number,
    public artificialId?: number,
  ) { }

  toJSONState(): Contrato {
    const copy: Contrato = Object.assign({}, this);
    return copy;
  }

  copyFromJSON(json: any) {
    if (json && json.manual) {
      const manual = new Manual().copyFromJSON(json.manual);
      return new Contrato(json.id, json.numeroContrato, new Date(json.dataInicioVigencia),
        new Date(json.dataFimVigencia), manual, json.ativo, json.diasDeGarantia);
    }
  }

  // TODO extrair modulo? entrar pro jsonable?
  clone(): Contrato {
    return new Contrato(this.id, this.numeroContrato, this.dataInicioVigencia,
      this.dataFimVigencia, this.manual, this.ativo, this.diasDeGarantia, this.artificialId);
  }

  dataInicioValida(): boolean {
      return this.dataInicioVigencia.getTime() < this.dataFimVigencia.getTime();
  }
}
