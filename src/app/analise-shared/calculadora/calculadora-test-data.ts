import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/index';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';

import * as _ from 'lodash';
import { FuncaoTransacao, TipoFuncaoTransacao } from '../../funcao-transacao';
import { ComplexidadeFuncionalDados as CFDados } from './complexidade-funcional-dados';
import { ComplexidadeFuncionalTransacao as CFTrans } from './complexidade-funcional-transacao';
import { ComplexidadeFuncionalEE, ComplexidadeFuncionalSEeCE, ComplexidadeFuncionalALIeAIE } from './complexidade-funcional';

export class CalculadoraTestData {

  private static readonly MAX_DER_DADOS = 201;
  private static readonly MAX_DER_TRANSACAO = 101;
  private static readonly MAX_TR = 21;

  static criaFatorAjusteUnitario2PF(): FatorAjuste {
    const fa: FatorAjuste = new FatorAjuste();
    fa.nome = 'unitario';
    fa.fator = 2.0;
    fa.tipoAjuste = TipoFatorAjuste.UNITARIO;
    return fa;
  }

  static criaFatorAjustePercentual50(): FatorAjuste {
    const fa: FatorAjuste = new FatorAjuste();
    fa.nome = 'percentual';
    fa.fator = 50;                   // Linha alterada. Original: fa.fator = 0.5;
    fa.tipoAjuste = TipoFatorAjuste.PERCENTUAL;
    return fa;
  }

  static criaFuncaoDadosALI(): FuncaoDados {
    return this.criaFuncaoDados(TipoFuncaoDados.ALI);
  }

  static criaFuncaoDados(tipo: TipoFuncaoDados): FuncaoDados {
    const func = new FuncaoDados();
    func.tipo = tipo;
    func.der = '5';
    func.rlr = '5';
    return func;
  }

  // TODO overload do typescript?
  static criaFuncaoDadosComValores(tipo: TipoFuncaoDados, der: number, rlr: number): FuncaoDados {
    const func = new FuncaoDados();
    func.tipo = tipo;
    func.der = der.toString();
    func.rlr = rlr.toString();
    return func;
  }

  static criaFuncaoDadosAIE(): FuncaoDados {
    return this.criaFuncaoDados(TipoFuncaoDados.AIE);
  }

  static criaFuncaoTransacaoEE(): FuncaoTransacao {
    return this.criaFuncaoTransacao(TipoFuncaoTransacao.EE, 5, 5);
  }

  static criaFuncaoTransacao(tipo: TipoFuncaoTransacao, der: number, ftr: number): FuncaoTransacao {
    const func = new FuncaoTransacao();
    func.tipo = tipo;
    func.der = der.toString();
    func.ftr = ftr.toString();
    return func;
  }

  static criaFuncaoTransacaoSE(): FuncaoTransacao {
    return this.criaFuncaoTransacao(TipoFuncaoTransacao.SE, 5, 5);
  }

  static criaFuncaoTransacaoCE(): FuncaoTransacao {
    return this.criaFuncaoTransacao(TipoFuncaoTransacao.CE, 5, 5);
  }

  // TODO criaXXsComplexidadeXXX() provavelmente logica em comum com testes de complexidadeFuncional
  static criaALIsComplexidadeBaixa(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeBaixa(TipoFuncaoDados.ALI);
  }

  private static criaFuncaoDadosComplexidadeBaixa(tipo: TipoFuncaoDados): FuncaoDados[] {
    const valoresDer: number[] = _.range(1, 51);
    const valoresRlr: number[] = _.range(1, 6);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeBaixaDados,
      valoresDer, valoresRlr
    );
  }

  private static criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
    tipo: TipoFuncaoDados, funcaoDentroDoIntervalo: (der: number, rlr: number) => boolean,
    valoresDer: number[], valoresRlr: number[]): FuncaoDados[] {

    const funcoesDados: FuncaoDados[] = [];
    const fatorAjustePercentual: FatorAjuste = this.criaFatorAjustePercentual50();

    if (valoresDer) {
      valoresDer.forEach(der => {
        if (valoresRlr) {
          valoresRlr.forEach(rlr => {
            if (funcaoDentroDoIntervalo(der, rlr)) {
              const funcao = this.criaFuncaoDadosComValores(tipo, der, rlr);
              funcao.fatorAjuste = fatorAjustePercentual;
              funcoesDados.push(funcao);
            }
          });
        }
      });
    }

    return funcoesDados;
  }

  private static valoresDentroDeComplexidadeBaixaDados(der: number, rlr: number) {
    return new ComplexidadeFuncionalALIeAIE(der, rlr).isBaixaComplexidade();
  }

  static criaALIsComplexidadeMedia(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeMedia(TipoFuncaoDados.ALI);
  }

  private static criaFuncaoDadosComplexidadeMedia(tipo: TipoFuncaoDados): FuncaoDados[] {
    const valoresDer: number[] = _.range(1, this.MAX_DER_DADOS);
    const valoresRlr: number[] = _.range(1, this.MAX_TR);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeMediaDados,
      valoresDer, valoresRlr
    );
  }

  private static valoresDentroDeComplexidadeMediaDados(der: number, rlr: number): boolean {
    return new ComplexidadeFuncionalALIeAIE(der, rlr).isMediaComplexidade();
  }

  static criaALIsComplexidadeAlta(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeAlta(TipoFuncaoDados.ALI);
  }

  private static criaFuncaoDadosComplexidadeAlta(tipo: TipoFuncaoDados): FuncaoDados[] {
    const valoresDer: number[] = _.range(20, this.MAX_DER_DADOS);
    const valoresRlr: number[] = _.range(2, this.MAX_TR);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeAltaDados,
      valoresDer, valoresRlr
    );
  }

  private static valoresDentroDeComplexidadeAltaDados(der: number, rlr: number): boolean {
    return new ComplexidadeFuncionalALIeAIE(der, rlr).isAltaComplexidade();
  }

  static criaAIEsComplexidadeBaixa(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeBaixa(TipoFuncaoDados.AIE);
  }

  static criaAIEsComplexidadeMedia(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeMedia(TipoFuncaoDados.AIE);
  }

  static criaAIEsComplexidadeAlta(): FuncaoDados[] {
    return this.criaFuncaoDadosComplexidadeAlta(TipoFuncaoDados.AIE);
  }

  static criaEEsComplexidadeBaixa(): FuncaoTransacao[] {
    const valoresDer: number[] = _.range(0, 16);
    const valoresFtr: number[] = _.range(0, 3);

    return this.criaFuncaoTransacaoComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoTransacao.EE, this.valoresDentroDeComplexidadeBaixaEE,
      valoresDer, valoresFtr);
  }

  private static criaFuncaoTransacaoComFatorAjustePercentualDentroDosIntervalos(
    tipo: TipoFuncaoTransacao, funcaoDentroDoIntervalo: (der: number, rlr: number) => boolean,
    valoresDer: number[], valoresFtr: number[]): FuncaoTransacao[] {

    const funcoesTransacao: FuncaoTransacao[] = [];
    const fatorAjustePercentual: FatorAjuste = this.criaFatorAjustePercentual50();

    if (valoresDer) {
      valoresDer.forEach(der => {
        if (valoresFtr) {
          valoresFtr.forEach(ftr => {
            if (funcaoDentroDoIntervalo(der, ftr)) {
              const funcao = this.criaFuncaoTransacao(tipo, der, ftr);
              funcao.fatorAjuste = fatorAjustePercentual;
              funcoesTransacao.push(funcao);
            }
          });
        }
      });
    }

    return funcoesTransacao;
  }

  private static valoresDentroDeComplexidadeBaixaEE(der: number, ftr: number) {
    return new ComplexidadeFuncionalEE(der, ftr).isBaixaComplexidade();
  }

  static criaEEsComplexidadeMedia(): FuncaoTransacao[] {
    const valoresDer: number[] = _.range(0, this.MAX_DER_TRANSACAO);
    const valoresFtr: number[] = _.range(0, this.MAX_TR);

    return this.criaFuncaoTransacaoComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoTransacao.EE, this.valoresDentroDeComplexidadeMediaEE,
      valoresDer, valoresFtr);
  }

  private static valoresDentroDeComplexidadeMediaEE(der: number, ftr: number) {
    return new ComplexidadeFuncionalEE(der, ftr).isMediaComplexidade();
  }

  static criaEEsComplexidadeAlta(): FuncaoTransacao[] {
    const valoresDer: number[] = _.range(5, this.MAX_DER_TRANSACAO);
    const valoresFtr: number[] = _.range(2, this.MAX_TR);

    return this.criaFuncaoTransacaoComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoTransacao.EE, this.valoresDentroDeComplexidadeAltaEE,
      valoresDer, valoresFtr);
  }

  private static valoresDentroDeComplexidadeAltaEE(der: number, ftr: number) {
    return new ComplexidadeFuncionalEE(der, ftr).isAltaComplexidade();
  }

  static criaSEsComplexidadeBaixa(): FuncaoTransacao[] {
    return this.criaFuncoesTransacaoSEouCEComComplexidadeBaixa(TipoFuncaoTransacao.SE);
  }

  private static criaFuncoesTransacaoSEouCEComComplexidadeBaixa(tipo: TipoFuncaoTransacao): FuncaoTransacao[] {
    const valoresDer: number[] = _.range(0, 20);
    const valoresFtr: number[] = _.range(0, 4);

    return this.criaFuncaoTransacaoComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeBaixaSEouCE,
      valoresDer, valoresFtr
    );
  }

  private static valoresDentroDeComplexidadeBaixaSEouCE(der: number, ftr: number): boolean {
    return new ComplexidadeFuncionalSEeCE(der, ftr).isBaixaComplexidade();
  }

  static criaSEsComplexidadeMedia(): FuncaoTransacao[] {
    return this.criaFuncoesTransacaoSEouCEComComplexidadeMedia(TipoFuncaoTransacao.SE);
  }

  private static criaFuncoesTransacaoSEouCEComComplexidadeMedia(tipo: TipoFuncaoTransacao): FuncaoTransacao[] {
    const valoresDer: number[] = _.range(0, this.MAX_DER_TRANSACAO);
    const valoresFtr: number[] = _.range(0, this.MAX_TR);

    return this.criaFuncaoTransacaoComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeMediaSEouCE,
      valoresDer, valoresFtr
    );
  }

  private static valoresDentroDeComplexidadeMediaSEouCE(der: number, ftr: number): boolean {
    return new ComplexidadeFuncionalSEeCE(der, ftr).isMediaComplexidade();
  }

  static criaSEsComplexidadeAlta(): FuncaoTransacao[] {
    return this.criaFuncoesTransacaoSEouCEComComplexidadeAlta(TipoFuncaoTransacao.SE);
  }

  private static criaFuncoesTransacaoSEouCEComComplexidadeAlta(tipo: TipoFuncaoTransacao): FuncaoTransacao[] {
    const valoresDer: number[] = _.range(6, this.MAX_DER_TRANSACAO);
    const valoresFtr: number[] = _.range(4, this.MAX_TR);

    return this.criaFuncaoTransacaoComFatorAjustePercentualDentroDosIntervalos(
      tipo, this.valoresDentroDeComplexidadeAltaSEouCE,
      valoresDer, valoresFtr
    );
  }

  private static valoresDentroDeComplexidadeAltaSEouCE(der: number, ftr: number): boolean {
   return new ComplexidadeFuncionalSEeCE(der, ftr).isAltaComplexidade();
  }

  static criaCEsComplexidadeBaixa(): FuncaoTransacao[] {
    return this.criaFuncoesTransacaoSEouCEComComplexidadeBaixa(TipoFuncaoTransacao.CE);
  }

  static criaCEsComplexidadeMedia(): FuncaoTransacao[] {
    return this.criaFuncoesTransacaoSEouCEComComplexidadeMedia(TipoFuncaoTransacao.CE);
  }

  static criaCEsComplexidadeAlta(): FuncaoTransacao[] {
    return this.criaFuncoesTransacaoSEouCEComComplexidadeAlta(TipoFuncaoTransacao.CE);
  }


}
