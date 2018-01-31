import { FuncaoDados, Complexidade } from '../funcao-dados/index';
import { MetodoContagem } from '../analise/index';

export class Calculadora {

  private static funcaoDados: FuncaoDados;
  private static metodoContagem: MetodoContagem;

  // ainda não sei como vai ficar após generalizar
  private static funcaoDadosCalculada: FuncaoDados;

  private static fatorPF: number;

  // TODO extrair uma interface implementada por FuncaoDados e FuncaoTransacao
  public static calcular(metodoContagem: MetodoContagem, funcaoDados: FuncaoDados) {
    this.inicializaVariaveis(metodoContagem, funcaoDados);
    this.calcularDeAcordoComMetodoContagem();
    this.aplicarFator();

  }

  private static inicializaVariaveis(metodoContagem: MetodoContagem, funcaoDados: FuncaoDados) {
    this.funcaoDadosCalculada = new FuncaoDados();
    this.funcaoDados = funcaoDados;
    this.metodoContagem = metodoContagem;
  }

  private static calcularDeAcordoComMetodoContagem() {
    switch (this.metodoContagem) {
      case MetodoContagem.INDICATIVA: {
        this.calcularIndicativa();
        break;
      }
      case MetodoContagem.ESTIMADA:
      case MetodoContagem.DETALHADA:
        this.calcularNaoIndicativa();
    }
  }

  private static calcularIndicativa() {
    this.funcaoDadosCalculada.der = '0';
    this.funcaoDadosCalculada.rlr = '0';
    this.funcaoDadosCalculada.complexidade = Complexidade.SEM;
    this.defineFatorPFIndicativaDeAcordoComGrupoDadosLogicos();
  }

  private static defineFatorPFIndicativaDeAcordoComGrupoDadosLogicos() {
    // TODO extrair constantes
    if (this.funcaoDados.tipo === 'ALI') {
      this.fatorPF = 35;
    } else { // AIE
      this.fatorPF = 15;
    }
  }

  private static calcularNaoIndicativa() {
    this.definirComplexidade();
    this.calcularPfsDeAcordoComGrupoDeDadosLogicos();
  }

  private static definirComplexidade() {
    if (this.funcaoDados.tipo === 'UNITÁRIO') {
      this.funcaoDadosCalculada.complexidade = Complexidade.SEM;
    } else {
      this.definirComplexidadePercentual();
    }
  }

  private static definirComplexidadePercentual() {
    let complexidade = this.funcaoDadosCalculada.complexidade;
    const der = this.funcaoDados.derValue();
    const rlr = this.funcaoDados.rlrValue();
    if (der === 1) {
      if (rlr) {
        complexidade = Complexidade.BAIXA;
      } else {
        complexidade = Complexidade.MEDIA;
      }
    } else if (der >= 2 && der <= 5) {
      if (rlr <= 19) {
        complexidade = Complexidade.BAIXA;
      } else if (rlr >= 20 && rlr <= 50) {
        complexidade = Complexidade.MEDIA;
      } else if (rlr >= 51) {
        complexidade = Complexidade.ALTA;
      }
    } else if (der >= 6) {
      if (rlr <= 19) {
        complexidade = Complexidade.MEDIA;
      } else if (rlr >= 20) {
        complexidade = Complexidade.ALTA;
      }
    }
  }

  private static calcularPfsDeAcordoComGrupoDeDadosLogicos() {
    if (this.funcaoDados.tipo === 'ALI') {
      this.calcularFatorPFDeAcordoComComplexidadeALI();
    } else { // AIE
      this.calcularFatorPFDeAcordoComComplexidadeAIE();
    }
  }

  private static calcularFatorPFDeAcordoComComplexidadeALI() {
    switch (this.funcaoDadosCalculada.complexidade) {
      case Complexidade.BAIXA: {
        this.fatorPF = 7;
        break;
      }
      case Complexidade.MEDIA: {
        this.fatorPF = 10;
        break;
      }
      case Complexidade.ALTA: {
        this.fatorPF = 15;
        break;
      }
      default: this.fatorPF = 7;
    }
  }

  private static calcularFatorPFDeAcordoComComplexidadeAIE() {
    switch (this.funcaoDadosCalculada.complexidade) {
      case Complexidade.BAIXA: {
        this.fatorPF = 5;
        break;
      }
      case Complexidade.MEDIA: {
        this.fatorPF = 7;
        break;
      }
      case Complexidade.ALTA: {
        this.fatorPF = 10;
        break;
      }
      default: this.fatorPF = 5;
    }
  }

  private static aplicarFator() {
    this.funcaoDadosCalculada.grossPf = this.funcaoDados.pf;
    let valorAplicado = 0;
    if (this.funcaoDados.tipo === 'PERCENTUAL') {
      // XXX de repente um método de FuncaoDados/Transacao?
      valorAplicado = this.funcaoDados.pf * this.funcaoDados.fatorAjuste.fator;
    } else { // UNITÁRIO
      // XXX unitário aplica somente o fator???
      valorAplicado = this.fatorPF;
      // alterando do codigo original. coloquei em definirComplexidade()
      // this.funcaoDadosCalculada.complexidade = Complexidade.SEM;
    }
    this.funcaoDadosCalculada.pf = valorAplicado;
  }

}
