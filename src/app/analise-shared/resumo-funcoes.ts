import { Complexidade } from './complexidade-enum';
import { AnaliseSharedUtils } from './index';

export interface FuncaoResumivel {

  complexidade?: Complexidade;
  pf?: number;
  grossPf?: number;

  tipoAsString(): string;

}

export class ResumoTotal {

  private _resumosGrupoLogico: ResumoGrupoLogico[] = [];

  private readonly _resumoFuncoes: ResumoFuncoes[];

  private readonly _complexidades: string[] = AnaliseSharedUtils.complexidades;

  constructor(...resumoFuncoes: ResumoFuncoes[]) {
    this._resumoFuncoes = resumoFuncoes;
    this.adicionaTodosResumosGrupoLogicoDeCadaResumoFuncoes();
    const totalResumoGrupoLogico = this.geraTotalComoResumoGrupoLogico();
    this._resumosGrupoLogico.push(totalResumoGrupoLogico);
  }

  private adicionaTodosResumosGrupoLogicoDeCadaResumoFuncoes() {
    this._resumoFuncoes.forEach(resumo => {
      this._resumosGrupoLogico = this._resumosGrupoLogico.concat(resumo.all);
    });
  }

  private geraTotalComoResumoGrupoLogico(): ResumoGrupoLogico {
    const total: ResumoGrupoLogico = new ResumoGrupoLogico('Total');
    this._resumosGrupoLogico.forEach(resumoGrupoLogico => {
      this._complexidades.forEach(complexidade => {
        const funcaoResumivelDTO: FuncaoResumivelDTO = new FuncaoResumivelDTO(
          Complexidade[complexidade],
          resumoGrupoLogico.totalPf,
          resumoGrupoLogico.totalGrossPf);
      });
    });
    return total;
  }

  get all(): ResumoGrupoLogico[] {
    return this._resumosGrupoLogico;
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

export class ResumoGrupoLogico {

  label: string;

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
    // TODO extrair metodo
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
