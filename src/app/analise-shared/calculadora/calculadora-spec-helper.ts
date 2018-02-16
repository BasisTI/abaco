import { FatorAjuste } from '../../fator-ajuste/index';
import { Complexidade } from '../complexidade-enum';
import { FatorAjusteLabelGenerator } from '../../shared/fator-ajuste-label-generator';
import { FuncaoDados } from '../../funcao-dados';

export class CalculadoraSpecHelper {

  private _funcaoEntrada: FuncaoDados;
  private _fatorAjuste: FatorAjuste;
  private _pfBruto: number;
  private _pfLiquido: number;
  private _complexidade: Complexidade;

  constructor() { }

  setFuncaoEntrada(funcao: FuncaoDados): CalculadoraSpecHelper {
    this._funcaoEntrada = funcao;
    return this;
  }

  get funcaoEntrada(): FuncaoDados {
    return this._funcaoEntrada;
  }

  setFatorAjuste(fa: FatorAjuste): CalculadoraSpecHelper {
    if (!this._funcaoEntrada) {
      throw Error('use o setFuncaoEntrada() antes');
    }
    this._fatorAjuste = fa;
    this._funcaoEntrada.fatorAjuste = fa;
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
    const der = `DER: '${this._funcaoEntrada.derValue()}'`;
    const rlr = `RLR: '${this._funcaoEntrada.rlrValue()}'`;
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
