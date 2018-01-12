import { BaseEntity, JSONable } from '../shared'
import { TipoFase } from '../tipo-fase';

export class EsforcoFase implements BaseEntity, JSONable<EsforcoFase>{
  constructor(
    public id?: number,
    public tipoFase?: TipoFase,
    public percentual?: number
    // FIXME BaseEntity, para evitar dependencias circulares
    // parece que reestruturação de pastas evita isso
  ) {

  }

  copyFromJSON(json: any) {
    // TODO converter manual?
    return new EsforcoFase(json.tipoFase, json.percentual);
  }

  toJSONState(): EsforcoFase {
    const copy: EsforcoFase = Object.assign({}, this);
    return copy;
  }

  clone(): EsforcoFase {
    return new EsforcoFase(this.id, this.tipoFase, this.percentual);
  }
}
