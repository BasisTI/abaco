import { Complexidade } from '../analise-shared/complexidade-enum';
import { MetodoContagem } from '../analise/index';
import { TipoFatorAjuste } from '../fator-ajuste/index';
import { FuncaoTransacao, TipoFuncaoTransacao } from '../funcao-transacao/funcao-transacao.model';
import { ComplexidadeFuncionalTransacao } from './calculadora/complexidade-funcional-transacao';

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
    const funcaoTransacao = this.funcaoTransacao;
    if (this.metodoContagem === MetodoContagem.ESTIMADA) {
      this.funcaoTransacaoCalculada.complexidade = Complexidade.MEDIA;
    } else {
      const tipo = this.funcaoTransacao.tipo;
      this.funcaoTransacaoCalculada.complexidade =
        ComplexidadeFuncionalTransacao.calcular(
          this.funcaoTransacao.tipo,
          funcaoTransacao.derValue(), funcaoTransacao.ftrValue()
        );
    }
  }

  private static calcularPfsDeAcordoComGrupoDeDadosLogicos() {
    const tipo = this.funcaoTransacao.tipo;
    if (tipo === TipoFuncaoTransacao.EE || tipo === TipoFuncaoTransacao.CE) {
      this.calcularPFDeAcordoComComplexidadeEEeCE();
    } else { // TipoFuncaoTransacao.SE
      this.calcularPFDeAcordoComComplexidadeSE();
    }
  }

  private static calcularPFDeAcordoComComplexidadeEEeCE() {
    switch (this.funcaoTransacaoCalculada.complexidade) {
      case Complexidade.BAIXA: {
        this.funcaoTransacaoCalculada.pf = 3;
        break;
      }
      case Complexidade.MEDIA: {
        this.funcaoTransacaoCalculada.pf = 4;
        break;
      }
      case Complexidade.ALTA: {
        this.funcaoTransacaoCalculada.pf = 6;
        break;
      }
      default: this.funcaoTransacaoCalculada.pf = 3;
    }
  }

  private static calcularPFDeAcordoComComplexidadeSE() {
    switch (this.funcaoTransacaoCalculada.complexidade) {
      case Complexidade.BAIXA: {
        this.funcaoTransacaoCalculada.pf = 4;
        break;
      }
      case Complexidade.MEDIA: {
        this.funcaoTransacaoCalculada.pf = 5;
        break;
      }
      case Complexidade.ALTA: {
        this.funcaoTransacaoCalculada.pf = 7;
        break;
      }
      default: this.funcaoTransacaoCalculada.pf = 4;
    }
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
