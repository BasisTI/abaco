import { FatorAjuste } from '../../fator-ajuste/index';
import { Complexidade } from '../complexidade-enum';
import { FatorAjusteLabelGenerator } from '../../shared/fator-ajuste-label-generator';
import { FuncaoDados } from '../../funcao-dados';

export class CalculadoraSpecHelper {

  private _funcaoDadosEntrada: FuncaoDados;
  private _fatorAjuste: FatorAjuste;
  private _pfBruto: number;
  private _pfLiquido: number;
  private _complexidade: Complexidade;

  constructor() { }

  setFuncaoDadosEntrada(funcao: FuncaoDados): CalculadoraSpecHelper {
    this._funcaoDadosEntrada = funcao;
    return this;
  }

  get funcaoDadosEntrada(): FuncaoDados {
    return this._funcaoDadosEntrada;
  }

  setFatorAjuste(fa: FatorAjuste): CalculadoraSpecHelper {
    if (!this._funcaoDadosEntrada) {
      throw Error('use o setFuncaoEntrada() antes');
    } else {
      this._funcaoDadosEntrada.fatorAjuste = fa;
    }

    

    this._fatorAjuste = fa;
    return this;
  }

  get fatorAjuste(): FatorAjuste {
    return this._fatorAjuste;
  }

  setPfBruto(pfB: number): CalculadoraSpecHelper {
    this._pfBruto = pfB;
    return this;
  }

  get pfBruto(): number {
    return this._pfBruto;
  }

  setComplexidade(c: Complexidade): CalculadoraSpecHelper {
    this._complexidade = c;
    return this;
  }

  get complexidade(): Complexidade {
    return this._complexidade;
  }

  get descricaoDaFuncao(): string {
    const der = `DER: '${this._funcaoDadosEntrada.derValue()}'`;
    const rlr = `RLR: '${this._funcaoDadosEntrada.rlrValue()}'`;
    return `Função com ${der}, ${rlr}`;
  }

  get fatorAjusteLabel(): string {
    return FatorAjusteLabelGenerator.generate(this._fatorAjuste);
  }

  calculaPfLiquido(): number {
    if (!this._pfLiquido) {
      this._pfLiquido = this.doCalculaPfLiquido();
    }
    return this._pfLiquido;
  }

  private doCalculaPfLiquido(): number {
    const fatorAjuste: FatorAjuste = this._fatorAjuste;
    if (fatorAjuste.isUnitario()) {
      return fatorAjuste.fator;
    } else {
      return this._pfBruto * fatorAjuste.fator;
    }
  }

}
