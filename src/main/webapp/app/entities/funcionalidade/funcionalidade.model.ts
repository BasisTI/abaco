import { Modulo } from '../modulo';
import { FuncaoDados } from '../funcao-dados';
import { FuncaoTransacao } from '../funcao-transacao';
export class Funcionalidade {
    constructor(
        public id?: number,
        public nome?: string,
        public modulo?: Modulo,
        public funcaoDados?: FuncaoDados,
        public funcaoTransacao?: FuncaoTransacao,
        public module_id?: number
    ) {
    }
}
