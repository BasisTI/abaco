import { ManualContrato } from './../organizacao/ManualContrato.model';
import { Manual } from '../manual';
import { BaseEntity } from '../shared';
import { MappableEntities } from '../shared/mappable-entities';

export class Contrato implements BaseEntity{

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
    if (json) {
      let manualContrato: ManualContrato[];
      if (json.manualContrato) {
        manualContrato = json.manualContrato.map(
          mc => new ManualContrato().copyFromJSON(mc)
        );
      }
      return new Contrato(json.id, json.numeroContrato, new Date(json.dataInicioVigencia),
        new Date(json.dataFimVigencia), null, json.ativo, json.diasDeGarantia, null, manualContrato);
    }
  }

  addManualContrato(manualContrato: ManualContrato) {
    this.mappableManualContrato.push(manualContrato);
    this.manualContrato = this.mappableManualContrato.values();
  }

  updateManualContrato(manualContrato: ManualContrato) {
    this.mappableManualContrato.update(manualContrato);
    this.manualContrato = this.mappableManualContrato.values();
  }

  deleteManualContrato(manualContrato: ManualContrato) {
    this.mappableManualContrato.delete(manualContrato);
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
