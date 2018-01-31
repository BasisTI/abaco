import { BaseEntity, MappableEntities } from '../shared';
import { Contrato } from '../contrato';
import { EsforcoFase } from '../esforco-fase/index';
import { Sistema } from '../sistema/index';
import { FuncaoDados, Complexidade } from '../funcao-dados/index';

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

  public generateResumoFuncaoDados(): ResumoFuncaoDados {
    const resumo: ResumoFuncaoDados = new ResumoFuncaoDados();
    this.funcaoDados.forEach(f => {
      resumo.ocorrencia(f);
    });
    return resumo;
  }
}


export class ResumoFuncaoDados {

  private _resumoALI: ResumoGrupoLogico = new ResumoGrupoLogico();

  private _resumoAIE: ResumoGrupoLogico = new ResumoGrupoLogico();

  private _totalAmbosGrupos = 0;

  ocorrencia(funcaoDados: FuncaoDados) {
    if (funcaoDados.tipo === 'AIE') {
      this._resumoAIE.complexidadeOcorrida(funcaoDados.complexidade);
      this._resumoAIE.incrementaPfs(funcaoDados.pf, funcaoDados.grossPf);
    } else {
      this._resumoALI.complexidadeOcorrida(funcaoDados.complexidade);
      this._resumoALI.incrementaPfs(funcaoDados.pf, funcaoDados.grossPf);
    }
    this._totalAmbosGrupos += 1;
  }
}

export class ResumoGrupoLogico {

  private complexidadeToTotal: Map<string, number>;

  private _totalPf = 0;

  private _totalGrossPf = 0;

  constructor() {
    this.complexidadeToTotal = new Map<string, number>();
    this.inicializaOcorrenciasComoZeroParaComplexidades();
  }

  private inicializaOcorrenciasComoZeroParaComplexidades() {
    for (const enumMember in Complexidade) {
      if (parseInt(enumMember, 10) >= 0) {
        this.complexidadeToTotal.set(Complexidade[enumMember], 0);
      }
    }
  }

  complexidadeOcorrida(complexidade: Complexidade) {
    const complexidadeStr = complexidade;
    const totalDaComplexidade = this.complexidadeToTotal.get(complexidadeStr);
    this.complexidadeToTotal.set(complexidadeStr, totalDaComplexidade + 1);
  }

  incrementaPfs(pf: number, grossPf: number) {
    this._totalPf += pf;
    this._totalGrossPf += grossPf;
  }

  get totalPf() {
    return this._totalPf;
  }

  get totalGrossPf() {
    return this._totalGrossPf;
  }

  totalPorComplexidade(complexidade: Complexidade): number {
    return this.complexidadeToTotal.get(complexidade.toString());
  }

}
