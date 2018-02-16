import { FuncaoDados } from '../funcao-dados/funcao-dados.model';
import { Complexidade } from '../analise-shared/complexidade-enum';
import { MetodoContagem } from '../analise/index';
import { TipoFatorAjuste } from '../fator-ajuste/index';
import { ComplexidadeFuncionalDados } from './calculadora/complexidade-funcional-dados';

export class Calculadora {

  private static funcaoDados: FuncaoDados;
  private static metodoContagem: MetodoContagem;

  // ainda não sei como vai ficar após generalizar
  private static funcaoDadosCalculada: FuncaoDados;

  private static fatorPF: number;

  // TODO extrair uma interface implementada por FuncaoDados e FuncaoTransacao
  public static calcular(metodoContagem: MetodoContagem, funcaoDados: FuncaoDados): FuncaoDados {
    this.inicializaVariaveis(metodoContagem, funcaoDados);
    this.calcularDeAcordoComMetodoContagem();
    this.aplicarFator();
    return this.funcaoDadosCalculada;
  }

  private static inicializaVariaveis(metodoContagem: MetodoContagem, funcaoDados: FuncaoDados) {
    this.funcaoDadosCalculada = funcaoDados.clone();
    this.funcaoDados = funcaoDados;
    this.metodoContagem = metodoContagem;
  }

  private static calcularDeAcordoComMetodoContagem() {
    switch (this.metodoContagem.toString()) {
      case 'INDICATIVA': {
        this.calcularIndicativa();
        break;
      }
      case 'ESTIMADA':
      case 'DETALHADA':
        this.calcularNaoIndicativa();
    }
  }

  private static calcularIndicativa() {
    this.funcaoDadosCalculada.der = '0';
    this.funcaoDadosCalculada.rlr = '0';
    this.funcaoDadosCalculada.complexidade = Complexidade.SEM;
    this.definePFIndicativaDeAcordoComGrupoDadosLogicos();
  }

  private static definePFIndicativaDeAcordoComGrupoDadosLogicos() {
    // TODO extrair constantes
    if (this.funcaoDados.tipo === 'ALI') {
      this.funcaoDadosCalculada.pf = 35;
    } else { // AIE
      this.funcaoDadosCalculada.pf = 15;
    }
  }

  private static calcularNaoIndicativa() {
    this.definirComplexidade();
    this.calcularPfsDeAcordoComGrupoDeDadosLogicos();
  }

  private static definirComplexidade() {
    // FIXME é isso aqui mesmo? funcao de dados sempre vai ter fatorAjuste?
    if (this.funcaoDados.fatorAjuste.isUnitario()) {
      this.funcaoDadosCalculada.complexidade = Complexidade.SEM;
    } else {
      this.definirComplexidadePercentual();
    }
  }

  private static definirComplexidadePercentual() {
    this.funcaoDadosCalculada.complexidade =
      ComplexidadeFuncionalDados.calcular(this.funcaoDados.derValue(), this.funcaoDados.rlrValue());
  }

  private static calcularPfsDeAcordoComGrupoDeDadosLogicos() {
    if (this.funcaoDados.tipo === 'ALI') {
      this.calcularPFDeAcordoComComplexidadeALI();
    } else { // AIE
      this.calcularPFDeAcordoComComplexidadeAIE();
    }
  }

  private static calcularPFDeAcordoComComplexidadeALI() {
    switch (this.funcaoDadosCalculada.complexidade) {
      case Complexidade.BAIXA: {
        this.funcaoDadosCalculada.pf = 7;
        break;
      }
      case Complexidade.MEDIA: {
        this.funcaoDadosCalculada.pf = 10;
        break;
      }
      case Complexidade.ALTA: {
        this.funcaoDadosCalculada.pf = 15;
        break;
      }
      default: this.funcaoDadosCalculada.pf = 7;
    }
  }

  private static calcularPFDeAcordoComComplexidadeAIE() {
    switch (this.funcaoDadosCalculada.complexidade) {
      case Complexidade.BAIXA: {
        this.funcaoDadosCalculada.pf = 5;
        break;
      }
      case Complexidade.MEDIA: {
        this.funcaoDadosCalculada.pf = 7;
        break;
      }
      case Complexidade.ALTA: {
        this.funcaoDadosCalculada.pf = 10;
        break;
      }
      default: this.funcaoDadosCalculada.pf = 5;
    }
  }

  // FIXME aplicar fator que vem da aba geral também
  private static aplicarFator() {
    this.funcaoDadosCalculada.grossPF = this.funcaoDadosCalculada.pf;
    let valorAplicado = 0;
    const fator = this.funcaoDados.fatorAjuste.fator;
    if (this.funcaoDados.fatorAjuste.isPercentual()) {
      // XXX de repente um método de FuncaoDados/Transacao?
      valorAplicado = this.funcaoDadosCalculada.pf * fator;
    } else { // UNITÁRIO
      valorAplicado = fator;
    }
    this.funcaoDadosCalculada.pf = valorAplicado;
  }

}
