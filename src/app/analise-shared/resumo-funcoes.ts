import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './analise-shared-utils';

export interface FuncaoResumivel {

  complexidade?: Complexidade;
  pf?: number;
  grossPf?: number;

  tipoAsString(): string;

}

export class ResumoTotal {

  private _linhasResumo: LinhaResumo[] = [];

  private readonly _resumoFuncoes: ResumoFuncoes[];

  private readonly _complexidades: string[] = AnaliseSharedUtils.complexidades;

  constructor(...resumoFuncoes: ResumoFuncoes[]) {
    this._resumoFuncoes = resumoFuncoes;
    this.adicionaTodosResumosGrupoLogicoDeCadaResumoFuncoes();
    // this._linhasResumo.push(this.geraLinhaTotal());
  }

  private adicionaTodosResumosGrupoLogicoDeCadaResumoFuncoes() {
    this._resumoFuncoes.forEach(resumo => {
      this._linhasResumo = this._linhasResumo.concat(resumo.all);
    });
  }

  private geraLinhaTotal(): LinhaResumo {
   return null;
  }

  get all(): LinhaResumo[] {
    return this._linhasResumo;
  }

}

class FuncaoResumivelDTO implements FuncaoResumivel {

  readonly complexidade: Complexidade;
  readonly pf: number;
  readonly grossPf: number;

  constructor(complexidade: Complexidade, pf: number, grossPf: number) {
    this.complexidade = complexidade;
    this.pf = pf;
    this.grossPf = grossPf;
  }

  tipoAsString() {
    return this.complexidade.toString();
  }

}

export class ResumoFuncoes {

  private tipoGrupoLogicoToResumo: Map<string, ResumoGrupoLogico>;

  private _tipos: string[];

  constructor(tipos: string[]) {
    this._tipos = tipos;
    this.tipoGrupoLogicoToResumo = new Map<string, ResumoGrupoLogico>();
    this.criaResumoPorGrupoLogico();
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
  }

  get all(): ResumoGrupoLogico[] {
    return Array.from(this.tipoGrupoLogicoToResumo.values());
  }

}

interface LinhaResumo {

  readonly label;

  getTotalPf(): number;
  getTotalGrossPf(): number;
  getQuantidadeTotal(): number;
  totalPorComplexidade(complexidade: Complexidade): number;

}

export class ResumoGrupoLogico implements LinhaResumo {

  readonly label: string;

  private complexidadeToTotal: Map<string, number>;

  private _quantidadeTotal = 0;

  private _totalPf = 0;

  private _totalGrossPf = 0;

  constructor(label: string) {
    this.label = label;
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

  getTotalPf(): number {
    return this._totalPf;
  }

  getTotalGrossPf(): number {
    return this._totalGrossPf;
  }

  getQuantidadeTotal(): number {
    return this._quantidadeTotal;
  }

  totalPorComplexidade(complexidade: Complexidade): number {
    return this.complexidadeToTotal.get(complexidade.toString());
  }

}

class UltimaLinhaTotal implements LinhaResumo {

  readonly label;

  private complexidadeToTotal: Map<string, number>;

  private _quantidadeTotal = 0;

  private _totalPf = 0;

  private _totalGrossPf = 0;

  getTotalPf(): number {
    return this._totalPf;
  }

  getTotalGrossPf(): number {
    return this._totalGrossPf;
  }

  getQuantidadeTotal(): number {
    return this._quantidadeTotal;
  }

  totalPorComplexidade(complexidade: Complexidade): number {
    return this.complexidadeToTotal.get(complexidade.toString());
  }

}
