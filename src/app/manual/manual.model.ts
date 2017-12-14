import { BaseEntity } from '../shared';


export class Manual implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public observacao?: string,
    public valorVariacaoEstimada?: number,
    public valorVariacaoIndicativa?: number,
    public arquivoManualContentType?: string,
    public arquivoManual?: any,
    public esforcoFases?: BaseEntity[],
  ) {}
}
