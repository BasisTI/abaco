import { BaseEntity, MappableEntities, JSONable } from '../shared';
import { EsforcoFase } from '../esforco-fase/index';
import { FatorAjuste } from '../fator-ajuste/fator-ajuste.model';

export class Manual implements BaseEntity, JSONable<Manual> {

  private mappablePhaseEfforts: MappableEntities<EsforcoFase>;
  private mappableAdjustFactors: MappableEntities<FatorAjuste>;

  constructor(
    public id?: number,
    public nome?: string,
    public observacao?: string,
    public valorVariacaoEstimada?: number,
    public valorVariacaoIndicativa?: number,
    public arquivoManualId?: number,
    public fatoresAjuste?: FatorAjuste[],
    public esforcoFases?: EsforcoFase[],
    public artificialId?: number,
  ) {
    if (esforcoFases) {
      this.mappablePhaseEfforts = new MappableEntities<EsforcoFase>(esforcoFases);
    } else {
      this.esforcoFases = [];
      this.mappablePhaseEfforts = new MappableEntities<EsforcoFase>();
    }

    if (fatoresAjuste) {
      this.mappableAdjustFactors = new MappableEntities<FatorAjuste>(fatoresAjuste);
    } else {
      this.mappableAdjustFactors = new MappableEntities<FatorAjuste>();
    }
  }

  toJSONState(): Manual {
    const copy: Manual = Object.assign({}, this);
    return copy;
  }

  copyFromJSON(json: any) {
    const fatoresAjuste: FatorAjuste[] = json.fatoresAjuste
      .map(faJSON => new FatorAjuste().copyFromJSON(faJSON));
    const esforcoFases: EsforcoFase[] = json.esforcoFases
      .map(efJSON => new EsforcoFase().copyFromJSON(efJSON));
    return new Manual(json.id, json.nome, json.observacao, json.valorVariacaoEstimada,
      json.valorVariacaoIndicativa, json.arquivoManualId, fatoresAjuste, esforcoFases);
  }

  addEsforcoFases(esforcoFase: EsforcoFase) {
    this.mappablePhaseEfforts.push(esforcoFase);
    this.esforcoFases = this.mappablePhaseEfforts.values();
  }

  updateEsforcoFases(esforcoFase: EsforcoFase) {
    this.mappablePhaseEfforts.update(esforcoFase);
    this.esforcoFases = this.mappablePhaseEfforts.values();
  }

  deleteEsforcoFase(esforcoFase: EsforcoFase) {
    this.mappablePhaseEfforts.delete(esforcoFase);
    this.esforcoFases = this.mappablePhaseEfforts.values();
  }

  addFatoresAjuste(fatorAjuste: FatorAjuste) {
    this.mappableAdjustFactors.push(fatorAjuste);
    this.fatoresAjuste = this.mappableAdjustFactors.values();
  }

  updateFatoresAjuste(fatorAjuste: FatorAjuste) {
    this.mappableAdjustFactors.update(fatorAjuste);
    this.fatoresAjuste = this.mappableAdjustFactors.values();
  }

  deleteFatoresAjuste(fatorAjuste: FatorAjuste) {
    this.mappableAdjustFactors.delete(fatorAjuste);
    this.fatoresAjuste = this.mappablePhaseEfforts.values();
  }
}
