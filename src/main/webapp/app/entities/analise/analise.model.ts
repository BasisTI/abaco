
import {Contrato} from "../contrato/contrato.model";
export const enum MetodoContagem {
    'DETALHADA',
    'INDICATIVA',
    'ESTIMADA'

};

export const enum TipoAnalise {
    'DESENVOLVIMENTO',
    'MELHORIA',
    'APLICACAO'

};
import { Sistema } from '../sistema';
import { FuncaoDados } from '../funcao-dados';
import { FuncaoTransacao } from '../funcao-transacao';
import {Organizacao} from "../organizacao/organizacao.model";
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
        public contrato?:Contrato,
        public organizacao?:Organizacao,
        public funcaoDados?: FuncaoDados[],
        public funcaoTransacaos?: FuncaoTransacao[],
    ) {
    }
}
