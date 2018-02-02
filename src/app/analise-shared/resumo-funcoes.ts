import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './analise-shared-utils';

export interface FuncaoResumivel {

  complexidade?: Complexidade;
  pf?: number;
  grossPf?: number;

  tipoAsString(): string;

}

// TODO classe abstrata comum para todos os Resumos
// fim das contas todos os resumos tem comportamento e caracteristicas em comum
// // total por complexidade
// // quantidade total, totalPf, totalGrossPf

export class ResumoTotal {

  readonly resumosFuncoes: ResumoFuncoes[];

  private _complexidadeToTotal: Map<string, number>;

  private _quantidadeTotal = 0;
  private _totalPf = 0;
  private _totalGrossPf = 0;

  private readonly complexidades: string[] = AnaliseSharedUtils.complexidades;

  constructor(...resumosFuncoes: ResumoFuncoes[]) {
    this.resumosFuncoes = resumosFuncoes;
    this.inicializaMapaComZeroParaComplexidades();
    resumosFuncoes.forEach(resumo => {
      this.somaComplexidadesPorResumo(resumo);
      this.incrementaTotais(resumo);
    });
  }

  private inicializaMapaComZeroParaComplexidades() {
    this.complexidades.forEach(c => this._complexidadeToTotal.set(c, 0));
  }

  private somaComplexidadesPorResumo(resumo: ResumoFuncoes) {
    this.complexidades.forEach(complexidade => {
      const totalDaComplexidade: number = resumo.totalPorComplexidade(Complexidade[complexidade]);
      this.incrementaPorComplexidade(complexidade, totalDaComplexidade);
    });
  }

  private incrementaPorComplexidade(complexidade: string, valor: number) {
    const totalDaComplexidade = this._complexidadeToTotal.get(complexidade);
    this._complexidadeToTotal.set(complexidade, totalDaComplexidade + valor);
  }

  private incrementaTotais(resumo: ResumoFuncoes) {
    this._totalPf += resumo.totalPf;
    this._totalGrossPf += resumo.totalGrossPf;
    this._quantidadeTotal += resumo.quantidadeTotal;
  }

  totalPorComplexidade(complexidade: Complexidade): number {
    return this._complexidadeToTotal.get(complexidade.toString());
  }

  get quantidadeTotal() {
    return this._quantidadeTotal;
  }

  get totalPf() {
    return this._totalPf;
  }

  get totalGrossPf() {
    return this._totalGrossPf;
  }

}

export class ResumoFuncoes {

  private tipoGrupoLogicoToResumo: Map<string, ResumoGrupoLogico>;

  private _tipos: string[];

  private _complexidadeToTotal: Map<string, number>;

  private _quantidadeTotal = 0;
  private _totalPf = 0;
  private _totalGrossPf = 0;

  private readonly complexidades: string[] = AnaliseSharedUtils.complexidades;

  constructor(tipos: string[]) {
    this._tipos = tipos;
    this.tipoGrupoLogicoToResumo = new Map<string, ResumoGrupoLogico>();
    this.inicializaMapaComZeroParaComplexidades();
    this.criaResumoPorGrupoLogico();
  }

  private inicializaMapaComZeroParaComplexidades() {
    this.complexidades.forEach(c => this._complexidadeToTotal.set(c, 0));
  }

  private criaResumoPorGrupoLogico() {
    this._tipos.forEach(tipo => {
      const resumo: ResumoGrupoLogico = new ResumoGrupoLogico(tipo);
      this.tipoGrupoLogicoToResumo.set(tipo, resumo);
    });
  }

  somaFuncao(funcao: FuncaoResumivel) {
    const tipoGrupoLogico = funcao.tipoAsString();
    const resumo = this.tipoGrupoLogicoToResumo.get(tipoGrupoLogico);
    resumo.incrementaTotais(funcao);

    this.incrementaTotais(funcao);
  }

  incrementaTotais(funcao: FuncaoResumivel) {
    this.incrementaPorComplexidade(funcao.complexidade);
    this.incrementaPfs(funcao.pf, funcao.grossPf);
    this._quantidadeTotal += 1;
  }

  private incrementaPorComplexidade(complexidade: Complexidade) {
    const complexidadeStr = complexidade;
    const totalDaComplexidade = this._complexidadeToTotal.get(complexidadeStr);
    this._complexidadeToTotal.set(complexidadeStr, totalDaComplexidade + 1);
  }

  private incrementaPfs(pf: number, grossPf: number) {
    this._totalPf += pf;
    this._totalGrossPf += grossPf;
  }

  get all(): ResumoGrupoLogico[] {
    return Array.from(this.tipoGrupoLogicoToResumo.values());
  }

  totalPorComplexidade(complexidade: Complexidade): number {
    return this._complexidadeToTotal.get(complexidade.toString());
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
    const complexidades: string[] = AnaliseSharedUtils.complexidades;
    complexidades.forEach(c => this.complexidadeToTotal.set(c, 0));
  }

  incrementaTotais(funcao: FuncaoResumivel) {
    this.incrementaPorComplexidade(funcao.complexidade);
    this.incrementaPfs(funcao.pf, funcao.grossPf);
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
