import { BaseEntity } from '../shared';
import { EsforcoFase } from '../esforco-fase/index';

export class Manual implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public observacao?: string,
    public valorVariacaoEstimada?: number,
    public valorVariacaoIndicativa?: number,
    public arquivoManualId?: number,
    public esforcoFases?: EsforcoFase[],
  ) {}
}
