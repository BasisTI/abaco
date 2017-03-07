import { Manual } from '../manual';
import { Fase } from '../fase';
export class EsforcoFase {
    constructor(
        public id?: number,
        public esforco?: number,
        public manual?: Manual,
        public fase?: Fase,
    ) {
    }
}
