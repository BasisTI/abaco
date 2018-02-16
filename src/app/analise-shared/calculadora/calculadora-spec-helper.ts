import { FatorAjuste } from '../../fator-ajuste/index';
import { Complexidade } from '../complexidade-enum';
import { FatorAjusteLabelGenerator } from '../../shared/fator-ajuste-label-generator';
import { FuncaoDados } from '../../funcao-dados';
import { FuncaoTransacao } from '../../funcao-transacao';

export class CalculadoraSpecHelper {

  private _funcaoDadosEntrada: FuncaoDados;
  private _funcaoTransacaoEntrada: FuncaoTransacao;
  private _fatorAjuste: FatorAjuste;
  private _pfBruto: number;
  private _pfLiquido: number;
  private _complexidade: Complexidade;

  constructor() { }

  setFuncaoDadosEntrada(funcao: FuncaoDados): CalculadoraSpecHelper {
    if (this._funcaoTransacaoEntrada) {
      throw Error('função de transação já adicionada');
    }

      this._funcaoDadosEntrada = funcao;
    return this;
  }

  get funcaoDadosEntrada(): FuncaoDados {
    return this._funcaoDadosEntrada;
  }

  setFuncaoTransacaoEntrada(funcao: FuncaoTransacao): CalculadoraSpecHelper {
    if (this._funcaoDadosEntrada) {
      throw Error('função de dados já adicionada');
    }

    this._funcaoTransacaoEntrada = funcao;
    return this;
  }

  get funcaoTransacaoEntrada(): FuncaoTransacao {
    return this._funcaoTransacaoEntrada;
  }

  setFatorAjuste(fa: FatorAjuste): CalculadoraSpecHelper {
    this.checaSeTemFuncaoESetaFatorAjusteNelaSeExistir(fa);
    this._fatorAjuste = fa;
    return this;
  }

  private checaSeTemFuncaoESetaFatorAjusteNelaSeExistir(fa: FatorAjuste) {
    let temFuncao = false;
    if (this._funcaoDadosEntrada) {
      this._funcaoDadosEntrada.fatorAjuste = fa;
      temFuncao = true;
    }
    if (this._funcaoTransacaoEntrada) {
      this._funcaoTransacaoEntrada.fatorAjuste = fa;
      temFuncao = true;
    }

    if (!temFuncao) {
      throw Error('use o setFuncaoDadosEntrada() ou setFuncaoTransacaoEntrada() antes');
    }
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
    if (this._funcaoTransacaoEntrada) {
      return this.geraDescricaoTransacao();
    } else if (this._funcaoDadosEntrada) {
      return this.geraDescricaoDados();
    }
  }

  private geraDescricaoDados(): string {
    const der = `DER: '${this._funcaoDadosEntrada.derValue()}'`;
    const rlr = `RLR: '${this._funcaoDadosEntrada.rlrValue()}'`;
    return `Função com ${der}, ${rlr}`;
  }

  private geraDescricaoTransacao(): string {
    const der = `DER: '${this._funcaoTransacaoEntrada.derValue()}'`;
    const rlr = `FTR: '${this._funcaoTransacaoEntrada.ftrValue()}'`;
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
