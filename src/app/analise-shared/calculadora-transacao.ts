import { Complexidade } from '../analise-shared/complexidade-enum';
import { MetodoContagem } from '../analise/analise.model';
import { TipoFatorAjuste } from '../fator-ajuste/fator-ajuste.model';
import { FuncaoTransacao, TipoFuncaoTransacao } from '../funcao-transacao/funcao-transacao.model';
import { ComplexidadeFuncionalTransacao } from './calculadora/complexidade-funcional-transacao';
import { PFPorTiposComplexidades } from './calculadora/pf-por-tipos-complexidades';

export class CalculadoraTransacao {

  private static funcaoTransacao: FuncaoTransacao;
  private static metodoContagem: MetodoContagem;

  // ainda não sei como vai ficar após generalizar
  private static funcaoTransacaoCalculada: FuncaoTransacao;

  private static fatorPF: number;

  // TODO extrair uma interface implementada por FuncaoDados e FuncaoTransacao
  public static calcular(metodoContagem: MetodoContagem, funcaoTransacao: FuncaoTransacao): FuncaoTransacao {
    this.inicializaVariaveis(metodoContagem, funcaoTransacao);
    this.definirComplexidade();
    this.calcularPfsDeAcordoComGrupoDeDadosLogicos();
    this.aplicarFator();
    return this.funcaoTransacaoCalculada;
  }

  private static inicializaVariaveis(metodoContagem: MetodoContagem, funcaoTransacao: FuncaoTransacao) {
    this.funcaoTransacaoCalculada = funcaoTransacao.clone();
    this.funcaoTransacao = funcaoTransacao;
    this.metodoContagem = metodoContagem;
  }

  private static definirComplexidade() {
    if (this.funcaoTransacao.fatorAjuste.isUnitario()) {
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
    let valorAplicado = 0;
    const fator = this.funcaoTransacao.fatorAjuste.fator;
    if (this.funcaoTransacao.fatorAjuste.isPercentual()) {
      // XXX de repente um método de FuncaoDados/Transacao?
      valorAplicado = this.funcaoTransacaoCalculada.pf * fator;
    } else { // UNITÁRIO
      valorAplicado = fator;
    }
    this.funcaoTransacaoCalculada.pf = valorAplicado;
  }

}
