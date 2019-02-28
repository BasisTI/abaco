import { ManualContrato } from './../organizacao/ManualContrato.model';
import { MappableEntities } from './../shared/mappable-entities';
import { BaseEntity, JSONable } from '../shared';
import { Manual } from '../manual';

export class Contrato implements BaseEntity, JSONable<Contrato> {

  private mappableManualContrato: MappableEntities<ManualContrato>;

  constructor(
    public id?: number,
    public numeroContrato?: String,
    public dataInicioVigencia?: Date,
    public dataFimVigencia?: Date,
    public manual?: Manual,
    public ativo?: boolean,
    public diasDeGarantia?: number,
    public artificialId?: number,
    public manualContrato?: ManualContrato[],
  ) {
    if (manualContrato) {
      manualContrato.forEach(m => m.contratos = this);
      this.mappableManualContrato = new MappableEntities<ManualContrato>(manualContrato);
    } else {
      this.manualContrato = [];
      this.mappableManualContrato = new MappableEntities<ManualContrato>();
    }
  }

  toJSONState(): Contrato {
    const copy: Contrato = Object.assign({}, this);
    return copy;
  }


  copyFromJSON(json: any) {
    console.log('copyFromJSON Contrato ', json);
    if (json) {
      return new Contrato(json.id, json.numeroContrato, new Date(json.dataInicioVigencia),
        new Date(json.dataFimVigencia), json.ativo, json.diasDeGarantia, json.manualContrato);
    }
  }

  addManualContrato(manualContrato: ManualContrato) {
    this.mappableManualContrato.push(manualContrato);
    this.manualContrato = this.mappableManualContrato.values();
  }

  // TODO extrair modulo? entrar pro jsonable?
  clone(): Contrato {
    return new Contrato(this.id, this.numeroContrato, this.dataInicioVigencia,
      this.dataFimVigencia, null, this.ativo, this.diasDeGarantia, this.artificialId, this.manualContrato);
  }

  dataInicioValida(): boolean {
    if (this.dataInicioVigencia != null && this.dataFimVigencia != null)
      return this.dataInicioVigencia.getTime() < this.dataFimVigencia.getTime();
  }
}
