import { Complexidade } from '../analise-shared/complexidade-enum';
import { MetodoContagem } from '../analise/analise.model';
import { FatorAjuste } from '../fator-ajuste/fator-ajuste.model';
import { Manual } from '../manual/manual.model';
import { CalculadoraFator } from './calculadora/calculadora-fator';
import { ComplexidadeFuncionalTransacao } from './calculadora/complexidade-funcional-transacao';
import { FatorAjusteImpactoRetriever } from './calculadora/fator-ajuste-impacto-retriever';
import { PFPorTiposComplexidades } from './calculadora/pf-por-tipos-complexidades';
import { FuncaoTransacao } from '../funcao-transacao';

export class CalculadoraTransacao {

  private static funcaoTransacao: FuncaoTransacao;
  private static metodoContagem: MetodoContagem;

  // ainda não sei como vai ficar após generalizar
  private static funcaoTransacaoCalculada: FuncaoTransacao;

  private static fatorPF: number;

  private static _manual: Manual;
  private static _fatorAjuste: FatorAjuste;

  // TODO extrair uma interface implementada por FuncaoDados e FuncaoTransacao
  public static calcular(metodoContagem: MetodoContagem, funcaoTransacao: FuncaoTransacao, manual?: Manual): FuncaoTransacao {
    this.inicializaVariaveis(metodoContagem, funcaoTransacao, manual);
    this.definirComplexidade();
    this.calcularPfsDeAcordoComGrupoDeDadosLogicos();
    this.aplicarFator();
    return this.funcaoTransacaoCalculada;
  }

  private static inicializaVariaveis(metodoContagem: MetodoContagem, funcaoTransacao: FuncaoTransacao, manual: Manual) {
    this.funcaoTransacaoCalculada = funcaoTransacao.clone();
    this.funcaoTransacao = funcaoTransacao;
    this.metodoContagem = metodoContagem;
    this.defineFatorAjuste(funcaoTransacao, manual);
  }

  private static defineFatorAjuste(ft: FuncaoTransacao, manual: Manual) {
    this._fatorAjuste = FatorAjusteImpactoRetriever.retrieve(ft.fatorAjuste, ft.impacto, manual);
  }

  private static definirComplexidade() {
    if (this._fatorAjuste.tipoAjuste === 'UNITARIO') {
      this.funcaoTransacaoCalculada.complexidade = Complexidade.SEM;
    } else {
      this.definirComplexidadePercentual();
    }
  }

  private static definirComplexidadePercentual() {
    if (this.metodoContagem === MetodoContagem.ESTIMADA) {
      this.funcaoTransacaoCalculada.complexidade = Complexidade.MEDIA;
    } else {
      this.definirComplexidadePercentualDetalhada();
    }
  }

  private static definirComplexidadePercentualDetalhada() {
    const funcaoTransacao = this.funcaoTransacao;
    this.funcaoTransacaoCalculada.complexidade =
      ComplexidadeFuncionalTransacao.calcular(
        this.funcaoTransacao.tipo,
        funcaoTransacao.derValue(),
        funcaoTransacao.ftrValue()
      );
  }

  private static calcularPfsDeAcordoComGrupoDeDadosLogicos() {
    this.funcaoTransacaoCalculada.pf = PFPorTiposComplexidades.getPorTipoEComplexidade(
      this.funcaoTransacao.tipo, this.funcaoTransacaoCalculada.complexidade
    );
  }

  // FIXME aplicar fator que vem da aba geral também
  private static aplicarFator() {
    this.funcaoTransacaoCalculada.grossPF = this.funcaoTransacaoCalculada.pf;
    this.funcaoTransacaoCalculada.pf = CalculadoraFator.aplicarFator(
      this.funcaoTransacaoCalculada.pf, this._fatorAjuste, this.funcaoTransacao.quantidade
    );
    this.funcaoTransacaoCalculada.grossPF = this.funcaoTransacaoCalculada.grossPF > 0 ? this.funcaoTransacaoCalculada.grossPF : this.funcaoTransacaoCalculada.pf;
  }

}
