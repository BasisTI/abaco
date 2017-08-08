import { Contrato } from '../contrato';
import { Sistema } from '../sistema';
export class Organizacao {
    constructor(
        public id?: number,
        public nome?: string,
        public cnpj?: string,
        public ativo?: boolean,
        public numeroOcorrencia?: string,
        public contracts?: Contrato[],
        public sistema?: Sistema,

    ) {
        this.ativo = true;
    }
}
