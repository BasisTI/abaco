import { BaseEntity } from '../shared';
import { Contrato } from '../contrato';
import { EsforcoFase } from '../esforco-fase/index';
import { Sistema } from '../sistema/index';

export const enum MetodoContagem {
  'DETALHADA',
  'INDICATIVA',
  'ESTIMADA'
}
export const enum TipoAnalise {
  'DESENVOLVIMENTO',
  'MELHORIA',
  'APLICACAO'
}

export class Analise implements BaseEntity {

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
    public funcaoDados?: BaseEntity[],
    public funcaoTransacaos?: BaseEntity[],
    public organizacao?: BaseEntity,
    public contrato?: Contrato,
    public esforcoFases?: EsforcoFase[]
  ) {}
}
