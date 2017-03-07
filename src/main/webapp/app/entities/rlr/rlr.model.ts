import { Der } from '../der';
import { FuncaoDados } from '../funcao-dados';
export class Rlr {
    constructor(
        public id?: number,
        public nome?: string,
        public der?: Der,
        public funcaoDados?: FuncaoDados,
    ) {
    }
}
