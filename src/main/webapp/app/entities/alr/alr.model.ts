import { FuncaoTransacao } from '../funcao-transacao';
import { FuncaoDados } from '../funcao-dados';
export class Alr {
    constructor(
        public id?: number,
        public funcaoTransacao?: FuncaoTransacao,
        public funcaoDados?: FuncaoDados,
    ) {
    }
}
