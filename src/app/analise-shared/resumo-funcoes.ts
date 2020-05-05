import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './analise-shared-utils';
import { Impacto } from './impacto-enum';

export interface FuncaoResumivel {

  complexidade?: Complexidade;
  pf?: number;
  grossPF?: number;
  impacto?: Impacto;
  tipoAsString(): string;

}

export class ResumoTotal {

  private _linhasResumo: LinhaResumo[] = [];

  private readonly _resumoFuncoes: ResumoFuncoes[];

  private readonly _ultimaLinhaTotal: UltimaLinhaTotal;

  private readonly _complexidades: string[] = AnaliseSharedUtils.complexidades;

  private readonly _impactos: string[] = AnaliseSharedUtils.impactos;

  constructor(...resumoFuncoes: ResumoFuncoes[]) {
    this._resumoFuncoes = resumoFuncoes;
    this.adicionaTodosResumosGrupoLogicoDeCadaResumoFuncoes();
    this._ultimaLinhaTotal = new UltimaLinhaTotal(this._linhasResumo);
    this._linhasResumo.push(this._ultimaLinhaTotal);
  }

  private adicionaTodosResumosGrupoLogicoDeCadaResumoFuncoes() {
    if (this._resumoFuncoes) {
      this._resumoFuncoes.forEach(resumo => {
        this._linhasResumo = this._linhasResumo.concat(resumo.all);
      });
    }
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
    if (this._tipos) {
      this._tipos.forEach(tipo => {
        const resumo: ResumoGrupoLogico = new ResumoGrupoLogico(tipo);
        this.tipoGrupoLogicoToResumo.set(tipo, resumo);
      });
    }
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
  totalPorImpacto(impacto: Impacto): number;

}

export interface LineResume {
  readonly pfAjustada: number;
  readonly pfTotal: number;
  readonly quantidadeTipo: number;
  readonly sem: number;
  readonly baixa: number;
  readonly media: number;
  readonly alta: number;
  readonly inm: number;
  readonly tipo: String;
  readonly label: number;
}

// TODO ResumoGrupoLogico / UltimaLinhaTotal podem herdar de uma classe abstrata comum
export class ResumoGrupoLogico implements LinhaResumo {

  readonly label: string;

  private complexidadeToTotal: Map<string, number>;

  private impactoTotal: Map<string, number>;

  private _quantidadeTotal = 0;

  private _totalPf = 0;

  private _totalGrossPF = 0;

  constructor(label: string) {
    this.label = label;
    this.complexidadeToTotal = new Map<string, number>();
    this.impactoTotal = new Map<string, number>();
    this.inicializaOcorrenciasComoZeroParaComplexidades();
    this.inicializaOcorrenciasComoZeroParaImpacto();
  }

  private inicializaOcorrenciasComoZeroParaComplexidades() {
    const complexidades: string[] = AnaliseSharedUtils.complexidades;
    if (complexidades) {
      complexidades.forEach(c => this.complexidadeToTotal.set(c, 0));
    }
  }

  /**
   * implementacao do impacto no resumo.
  */
  private inicializaOcorrenciasComoZeroParaImpacto() {
    const impactos: string[] = AnaliseSharedUtils.impactos;
    if (impactos) {
      impactos.forEach(c => this.impactoTotal.set(c, 0));
    }
  }

  incrementaTotais(funcao: FuncaoResumivel) {
    this.incrementaPorComplexidade(funcao.complexidade);
    this.incrementaPorImpacto(funcao.impacto);
    this.incrementaPfs(funcao.pf, funcao.grossPF);
    this._quantidadeTotal += 1;
  }

  private incrementaPorComplexidade(complexidade: Complexidade) {
    const complexidadeStr = complexidade;
    const totalDaComplexidade = this.complexidadeToTotal.get(complexidadeStr);
    this.complexidadeToTotal.set(complexidadeStr, totalDaComplexidade + 1);
  }

  /**
   * implementacao do impacto no resumo.
  */
  private incrementaPorImpacto(impacto: Impacto) {
    const impactoStr = impacto;
    const totalDoImpacto = this.impactoTotal.get(impactoStr);
    this.impactoTotal.set(impactoStr, totalDoImpacto + 1);
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

  /**
   *
  */
  totalPorImpacto(impacto: Impacto): number {
    return this.impactoTotal.get(impacto.toString());
  }

}

class UltimaLinhaTotal implements LinhaResumo {

  readonly label = 'Total';

  private readonly _linhasResumo: LinhaResumo[];

  private complexidadeToTotal: Map<string, number>;

  private impactoTotal: Map<string, number>;

  private _quantidadeTotal = 0;

  private _totalPf = 0;

  private _totalGrossPF = 0;

  constructor(linhasResumo: LinhaResumo[]) {
    this._linhasResumo = linhasResumo;
    this.inicializaMapa();
    this.inicializaMapaImpacto();
    this.somaTudo();
  }

  private inicializaMapa() {
    this.complexidadeToTotal = new Map<string, number>();
    const complexidades: string[] = AnaliseSharedUtils.complexidades;
    if (complexidades) {
      complexidades.forEach(c => this.complexidadeToTotal.set(c, 0));
    }
  }

  /**
   * implementacao do resumo impacto
  */
  private inicializaMapaImpacto() {
    this.impactoTotal = new Map<string, number>();
    const impactos: string[] = AnaliseSharedUtils.impactos;
    if (impactos) {
      impactos.forEach(c => this.impactoTotal.set(c, 0));
    }
  }

  /**
   *
  */
  private somaTudo() {
    if (this._linhasResumo) {
      this._linhasResumo.forEach(linhaResumo => {

        this.somarComplexidade(linhaResumo);
        this.somarImpacto(linhaResumo);
        this._totalPf += linhaResumo.getTotalPf();
        this._totalGrossPF += linhaResumo.getTotalGrossPF();
        this._quantidadeTotal += linhaResumo.getQuantidadeTotal();
      });
    }
  }

  /**
   *
   * @param linhaResumo
   */
  private somarComplexidade(linhaResumo: LinhaResumo) {
    const complexidades: string[] = AnaliseSharedUtils.complexidades;

    if (complexidades) {
      complexidades.forEach(complexidade => {
        const complexidadeEnum: Complexidade = Complexidade[complexidade];
        const totalDaComplexidade = linhaResumo.totalPorComplexidade(complexidadeEnum);
        this.incrementaPorComplexidade(complexidadeEnum, totalDaComplexidade);
      });
    }
  }

  /**
   *
   * @param linhaResumo
   */
  private somarImpacto(linhaResumo: LinhaResumo) {
    const impactos: string[] = AnaliseSharedUtils.impactos;

    if (impactos) {
      impactos.forEach(impacto => {
        const impactoEnum: Impacto = Impacto[impacto];
        const totalDoImpacto = linhaResumo.totalPorImpacto(impactoEnum);
        this.incrementarPorImpacto(impactoEnum, totalDoImpacto);
      });
    }
  }

  /**
   *
  */
  private incrementaPorComplexidade(complexidade: Complexidade, valor: number) {
    const complexidadeStr = complexidade;
    const totalDaComplexidade = this.complexidadeToTotal.get(complexidadeStr);
    this.complexidadeToTotal.set(complexidadeStr, totalDaComplexidade + valor);
  }

  /**
   * implementacao do resumo impacto
  */
  private incrementarPorImpacto(impacto: Impacto, valor: number) {
    const impactoStr = impacto;
    const totalDoImpacto = this.impactoTotal.get(impactoStr);
    this.impactoTotal.set(impactoStr, totalDoImpacto + valor);
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

  /**
   *
  */
  totalPorImpacto(impacto: Impacto): number {
    return this.impactoTotal.get(impacto.toString());
  }

}
