import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './analise-shared-utils';

export interface FuncaoResumivel {

  complexidade?: Complexidade;
  pf?: number;
  grossPF?: number;

  tipoAsString(): string;

}

export class ResumoTotal {

  private _linhasResumo: LinhaResumo[] = [];

  private readonly _resumoFuncoes: ResumoFuncoes[];

  private readonly _ultimaLinhaTotal: UltimaLinhaTotal;

  private readonly _complexidades: string[] = AnaliseSharedUtils.complexidades;

  constructor(...resumoFuncoes: ResumoFuncoes[]) {
    this._resumoFuncoes = resumoFuncoes;
    this.adicionaTodosResumosGrupoLogicoDeCadaResumoFuncoes();
    this._ultimaLinhaTotal = new UltimaLinhaTotal(this._linhasResumo);
    this._linhasResumo.push(this._ultimaLinhaTotal);
  }

  private adicionaTodosResumosGrupoLogicoDeCadaResumoFuncoes() {
    this._resumoFuncoes.forEach(resumo => {
      this._linhasResumo = this._linhasResumo.concat(resumo.all);
    });
  }

  get all(): LinhaResumo[] {
    return this._linhasResumo;
  }

  getTotalPf(): number {
    return this._ultimaLinhaTotal.getTotalPf();
  }

  getTotalGrossPf(): number {
    return this._ultimaLinhaTotal.getTotalGrossPF();
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

  get all(): LinhaResumo[] {
    return Array.from(this.tipoGrupoLogicoToResumo.values());
  }

}

export interface LinhaResumo {

  readonly label;

  getTotalPf(): number;
  getTotalGrossPF(): number;
  getQuantidadeTotal(): number;
  totalPorComplexidade(complexidade: Complexidade): number;

}

// TODO ResumoGrupoLogico / UltimaLinhaTotal podem herdar de uma classe abstrata comum
export class ResumoGrupoLogico implements LinhaResumo {

  readonly label: string;

  private complexidadeToTotal: Map<string, number>;

  private _quantidadeTotal = 0;

  private _totalPf = 0;

  private _totalGrossPF = 0;

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
    this.incrementaPfs(funcao.pf, funcao.grossPF);
    this._quantidadeTotal += 1;
  }

  private incrementaPorComplexidade(complexidade: Complexidade) {
    const complexidadeStr = complexidade;
    const totalDaComplexidade = this.complexidadeToTotal.get(complexidadeStr);
    this.complexidadeToTotal.set(complexidadeStr, totalDaComplexidade + 1);
  }

  private incrementaPfs(pf: number, grossPF: number) {
    this._totalPf += pf;
    this._totalGrossPF += grossPF;
  }

  getTotalPf(): number {
    return this._totalPf;
  }

  getTotalGrossPF(): number {
    return this._totalGrossPF;
  }

  getQuantidadeTotal(): number {
    return this._quantidadeTotal;
  }

  totalPorComplexidade(complexidade: Complexidade): number {
    return this.complexidadeToTotal.get(complexidade.toString());
  }

}

class UltimaLinhaTotal implements LinhaResumo {

  readonly label = 'Total';

  private readonly _linhasResumo: LinhaResumo[];

  private complexidadeToTotal: Map<string, number>;

  private _quantidadeTotal = 0;

  private _totalPf = 0;

  private _totalGrossPF = 0;

  constructor(linhasResumo: LinhaResumo[]) {
    this._linhasResumo = linhasResumo;
    this.inicializaMapa();
    this.somaTudo();
  }

  private inicializaMapa() {
    this.complexidadeToTotal = new Map<string, number>();
    const complexidades: string[] = AnaliseSharedUtils.complexidades;
    complexidades.forEach(c => this.complexidadeToTotal.set(c, 0));
  }

  private somaTudo() {
    const complexidades: string[] = AnaliseSharedUtils.complexidades;
    this._linhasResumo.forEach(linhaResumo => {
      complexidades.forEach(complexidade => {
        const complexidadeEnum: Complexidade = Complexidade[complexidade];
        const totalDaComplexidade = linhaResumo.totalPorComplexidade(complexidadeEnum);
        this.incrementaPorComplexidade(complexidadeEnum, totalDaComplexidade);
      });
      this._totalPf += linhaResumo.getTotalPf();
      this._totalGrossPF += linhaResumo.getTotalGrossPF();
      this._quantidadeTotal += linhaResumo.getQuantidadeTotal();
    });
  }

  private incrementaPorComplexidade(complexidade: Complexidade, valor: number) {
    const complexidadeStr = complexidade;
    const totalDaComplexidade = this.complexidadeToTotal.get(complexidadeStr);
    this.complexidadeToTotal.set(complexidadeStr, totalDaComplexidade + valor);
  }

  getTotalPf(): number {
    return this._totalPf;
  }

  getTotalGrossPF(): number {
    return this._totalGrossPF;
  }

  getQuantidadeTotal(): number {
    return this._quantidadeTotal;
  }

  totalPorComplexidade(complexidade: Complexidade): number {
    return this.complexidadeToTotal.get(complexidade.toString());
  }

}
