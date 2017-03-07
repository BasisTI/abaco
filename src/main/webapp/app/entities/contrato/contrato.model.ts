import { Manual } from '../manual';
export class Contrato {
    constructor(
        public id?: number,
        public numeroContrato?: string,
        public dataInicioVigencia?: any,
        public dataFimVigencia?: any,
        public manual?: Manual,
    ) {
    }
}
