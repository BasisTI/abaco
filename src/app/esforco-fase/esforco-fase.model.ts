import { BaseEntity, JSONable } from '../shared';
import { TipoFase } from '../tipo-fase';

export class EsforcoFase implements BaseEntity, JSONable<EsforcoFase> {
  constructor(
    public id?: number,
    public fase?: TipoFase,
    public esforco?: number,
    public artificialId?: number,
  ) {

  }

  copyFromJSON(json: any) {
    return new EsforcoFase(json.id, new TipoFase(json.fase.id, json.fase.nome), json.esforco * 100);
  }

  toJSONState(): EsforcoFase {
    return new EsforcoFase(this.id,
      new TipoFase(this.fase.id, this.fase.nome),
      this.esforco / 100);
  }

  clone(): EsforcoFase {
    return new EsforcoFase(this.id, this.fase, this.esforco, this.artificialId);
  }
}
