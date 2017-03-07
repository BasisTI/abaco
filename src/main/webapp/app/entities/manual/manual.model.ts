import { EsforcoFase } from '../esforco-fase';
export class Manual {
    constructor(
        public id?: number,
        public nome?: string,
        public observacao?: string,
        public valorVariacaoEstimada?: number,
        public valorVariacaoIndicativa?: number,
        public arquivoManual?: any,
        public esforcoFase?: EsforcoFase,
    ) {
    }
}
