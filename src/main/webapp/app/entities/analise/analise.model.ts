
const enum MetodoContagem {
    'DETALHADA',
    'INDICATIVA',
    'ESTIMADA'

};

const enum TipoAnalise {
    'DESENVOLVIMENTO',
    'MELHORIA',
    'APLICACAO'

};
import { Sistema } from '../sistema';
import { FuncaoDados } from '../funcao-dados';
import { FuncaoTransacao } from '../funcao-transacao';
export class Analise {
    constructor(
        public id?: number,
        public numeroOs?: string,
        public tipoContagem?: MetodoContagem,
        public valorAjuste?: number,
        public pfTotal?: string,
        public escopo?: string,
        public fronteiras?: string,
        public documentacao?: string,
        public tipoAnalise?: TipoAnalise,
        public propositoContagem?: string,
        public sistema?: Sistema,
        public funcaoDados?: FuncaoDados,
        public funcaoTransacao?: FuncaoTransacao,
    ) {
    }
}
