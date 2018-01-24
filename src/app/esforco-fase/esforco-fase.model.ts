import { BaseEntity, JSONable } from '../shared'
import { TipoFase } from '../tipo-fase';

export class EsforcoFase implements BaseEntity, JSONable<EsforcoFase>{
  constructor(
    public id?: number,
    public fase?: TipoFase,
    public esforco?: number,
    public artificialId?: number,
    public esforco?: number,
  ) {

  }

  copyFromJSON(json: any) {
    return new EsforcoFase(json.tipoFase, json.percentual);
  }

  toJSONState(): EsforcoFase {
    const copy: EsforcoFase = Object.assign({}, this);
    return copy;
  }

  // FIXME reavaliar. atributos estão errados
  clone(): EsforcoFase {
    return new EsforcoFase(this.id, this.fase, this.esforco, this.artificialId);
  }
}
