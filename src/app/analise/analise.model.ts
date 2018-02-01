import { BaseEntity, MappableEntities } from '../shared';
import { Contrato } from '../contrato';
import { EsforcoFase } from '../esforco-fase/index';
import { Sistema } from '../sistema/index';
import { FuncaoDados, TipoFuncaoDados } from '../funcao-dados/index';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { FuncaoTransacao } from '../funcao-transacao/index';

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

  private mappableFuncaoTransacaos: MappableEntities<FuncaoTransacao>;

  private _resumoFuncaoDados: ResumoFuncaoDados;

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
    public funcaoTransacaos?: FuncaoTransacao[],
    public organizacao?: BaseEntity,
    public contrato?: Contrato,
    public esforcoFases?: EsforcoFase[],
  ) {
    if (funcaoDados) {
      this.mappableFuncaoDados = new MappableEntities<FuncaoDados>(funcaoDados);
    } else {
      this.mappableFuncaoDados = new MappableEntities<FuncaoDados>();
    }
    if (funcaoTransacaos) {
      this.mappableFuncaoTransacaos = new MappableEntities<FuncaoTransacao>(funcaoTransacaos);
    } else {
      this.mappableFuncaoTransacaos = new MappableEntities<FuncaoTransacao>();
    }
  }

  public get resumoFuncaoDados(): ResumoFuncaoDados {
    return this._resumoFuncaoDados;
  }

  public addFuncaoDados(funcaoDados: FuncaoDados) {
    this.mappableFuncaoDados.push(funcaoDados);
    this.atualizarFuncoesDados();
  }

  private atualizarFuncoesDados() {
    this.funcaoDados = this.mappableFuncaoDados.values();
    this.generateResumoFuncaoDados();
  }

  // potencial para ficar bem eficiente
  // inserção/alteração/deleção pode ser feita por elemento
  private generateResumoFuncaoDados() {
    const resumo: ResumoFuncaoDados = new ResumoFuncaoDados();
    this.funcaoDados.forEach(f => {
      resumo.somaFuncao(f);
    });
    this._resumoFuncaoDados = resumo;
  }

  updateFuncaoDados(funcaoDados: FuncaoDados) {
    this.mappableFuncaoDados.update(funcaoDados);
    this.atualizarFuncoesDados();
  }

  deleteFuncaoDados(funcaoDados: FuncaoDados) {
    this.mappableFuncaoDados.delete(funcaoDados);
    this.atualizarFuncoesDados();
  }

  addFuncaoTransacao(funcaoTransacao: FuncaoTransacao) {
    this.mappableFuncaoTransacaos.push(funcaoTransacao);
  }

  private atualizarFuncoesTransacoes() {
    this.funcaoTransacaos = this.mappableFuncaoTransacaos.values();
    // TODO gerar resumo
  }

  updateFuncaoTransacao(funcaoTransacao: FuncaoTransacao) {
    this.mappableFuncaoTransacaos.update(funcaoTransacao);
  }

  deleteFuncaoTransacao(funcaoTransacao: FuncaoTransacao) {
    this.mappableFuncaoTransacaos.delete(funcaoTransacao);
  }


}


export class ResumoFuncaoDados {

  private tipoGrupoLogicoToResumo: Map<string, ResumoGrupoLogico>;

  constructor() {
    this.tipoGrupoLogicoToResumo = new Map<string, ResumoGrupoLogico>();
    this.criaResumoPorGrupoLogico();
  }

  private criaResumoPorGrupoLogico() {
    // TODO extrair metodo
    const tipoFuncoesDados: string[] = Object.keys(TipoFuncaoDados)
      .map(k => TipoFuncaoDados[k as any]);
    tipoFuncoesDados.forEach(tipo => {
      const resumo: ResumoGrupoLogico = new ResumoGrupoLogico(tipo);
      this.tipoGrupoLogicoToResumo.set(tipo, resumo);
    });
  }

  somaFuncao(funcaoDados: FuncaoDados) {
    const tipoGrupoLogico = funcaoDados.tipo;
    const resumo = this.tipoGrupoLogicoToResumo.get(tipoGrupoLogico);
    resumo.incrementaTotais(funcaoDados);
  }

  get all(): ResumoGrupoLogico[] {
    return Array.from(this.tipoGrupoLogicoToResumo.values());
  }

}

export class ResumoGrupoLogico {

  tipo: string;

  private complexidadeToTotal: Map<string, number>;

  private _quantidadeTotal = 0;

  private _totalPf = 0;

  private _totalGrossPf = 0;

  constructor(tipo: string) {
    this.tipo = tipo;
    this.complexidadeToTotal = new Map<string, number>();
    this.inicializaOcorrenciasComoZeroParaComplexidades();
  }

  private inicializaOcorrenciasComoZeroParaComplexidades() {
    // TODO extrair metodo
    const complexidades: string[] = Object.keys(Complexidade)
      .map(k => Complexidade[k as any]);
    complexidades.forEach(c => this.complexidadeToTotal.set(c, 0));
  }

  incrementaTotais(funcaoDados: FuncaoDados) {
    this.incrementaPorComplexidade(funcaoDados.complexidade);
    this.incrementaPfs(funcaoDados.pf, funcaoDados.grossPf);
    this._quantidadeTotal += 1;
  }

  private incrementaPorComplexidade(complexidade: Complexidade) {
    const complexidadeStr = complexidade;
    const totalDaComplexidade = this.complexidadeToTotal.get(complexidadeStr);
    this.complexidadeToTotal.set(complexidadeStr, totalDaComplexidade + 1);
  }

  private incrementaPfs(pf: number, grossPf: number) {
    this._totalPf += pf;
    this._totalGrossPf += grossPf;
  }

  get totalPf() {
    return this._totalPf;
  }

  get totalGrossPf() {
    return this._totalGrossPf;
  }

  get quantidadeTotal(): number {
    return this._quantidadeTotal;
  }

  totalPorComplexidade(complexidade: Complexidade): number {
    return this.complexidadeToTotal.get(complexidade.toString());
  }

}
