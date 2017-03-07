import { Organizacao } from '../organizacao';
import { Modulo } from '../modulo';
export class Sistema {
    constructor(
        public id?: number,
        public sigla?: string,
        public nome?: string,
        public numeroOcorrencia?: string,
        public organizacao?: Organizacao,
        public modulo?: Modulo,
    ) {
    }
}
