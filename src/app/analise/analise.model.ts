import { BaseEntity, MappableEntities } from '../shared';
import { Contrato } from '../contrato';
import { EsforcoFase } from '../esforco-fase/index';
import { Sistema } from '../sistema/index';
import { FuncaoDados } from '../funcao-dados/index';

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

  private mappableFuncaoDados: MappableEntities<FuncaoDados>;

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
    public funcaoDados?: FuncaoDados[],
    public funcaoTransacaos?: BaseEntity[],
    public organizacao?: BaseEntity,
    public contrato?: Contrato,
    public esforcoFases?: EsforcoFase[]
  ) {
    if (funcaoDados) {
      this.mappableFuncaoDados = new MappableEntities<FuncaoDados>(funcaoDados);
    } else {
      this.mappableFuncaoDados = new MappableEntities<FuncaoDados>();
    }
   }

  public addFuncaoDados(funcaoDados: FuncaoDados) {
    this.mappableFuncaoDados.push(funcaoDados);
    this.funcaoDados = this.mappableFuncaoDados.values();
  }
}
