import { Sistema } from '../sistema';
import { Funcionalidade } from '../funcionalidade';
export class Modulo {
    constructor(
        public id?: number,
        public nome?: string,
        public sistema?: Sistema,
        public funcionalidade?: Funcionalidade,
    ) {
    }
}
