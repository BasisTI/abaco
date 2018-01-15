import { BaseEntity, MappableEntities } from '../shared';
import { EsforcoFase } from '../esforco-fase/index';

export class Manual implements BaseEntity {

  private mappableContracts: MappableEntities<EsforcoFase>;

  constructor(
    public id?: number,
    public nome?: string,
    public observacao?: string,
    public valorVariacaoEstimada?: number,
    public valorVariacaoIndicativa?: number,
    public arquivoManualId?: number,
    public esforcoFases?: any[],
    public artificialId?: number,
  ) {
    if (esforcoFases) {
      this.mappableContracts = new MappableEntities<EsforcoFase>(esforcoFases);
    } else {
      this.esforcoFases = [];
      this.mappableContracts = new MappableEntities<EsforcoFase>();
    }
  }


  addEsforcoFases(esforcoFase: EsforcoFase) {
    this.mappableContracts.push(esforcoFase);
    this.esforcoFases = this.mappableContracts.values();
  }

  updateEsforcoFases(esforcoFase: EsforcoFase) {
    this.mappableContracts.update(esforcoFase);
    this.esforcoFases = this.mappableContracts.values();
  }

  deleteEsforcoFase(esforcoFase: EsforcoFase) {
    this.mappableContracts.delete(esforcoFase);
    this.esforcoFases = this.mappableContracts.values();
  }
}
