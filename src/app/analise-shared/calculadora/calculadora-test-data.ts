import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/index';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';

import * as _ from 'lodash';

export class CalculadoraTestData {

  private static readonly MAX_DER_DADOS = 201;
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
    fa.fator = 0.5;
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

  // TODO criaXXsComplexidadeXXX() provavelmente logica em comum com testes de complexidadeFuncional
  static criaALIsComplexidadeBaixa(): FuncaoDados[] {
    const valoresDer: number[] = _.range(1, 51);
    const valoresRlr: number[] = _.range(1, 6);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoDados.ALI, this.valoresDentroDeComplexidadeBaixaDados,
      valoresDer, valoresRlr
    );
  }

  private static criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
    tipo: TipoFuncaoDados, funcaoDentroDoIntervalo: (der: number, rlr: number) => boolean,
    valoresDer: number[], valoresRlr: number[]): FuncaoDados[] {

    const funcoesDados: FuncaoDados[] = [];
    const fatorAjustePercentual: FatorAjuste = this.criaFatorAjustePercentual50();

    valoresDer.forEach(der => {
      valoresRlr.forEach(rlr => {
        if (funcaoDentroDoIntervalo(der, rlr)) {
          const funcao = this.criaFuncaoDadosComValores(tipo, der, rlr);
          funcao.fatorAjuste = fatorAjustePercentual;
          funcoesDados.push(funcao);
        }
      });
    });

    return funcoesDados;
  }

  private static valoresDentroDeComplexidadeBaixaDados(der: number, rlr: number) {
    return der < 20 || (der > 20 && rlr === 1);
  }

  static criaALIsComplexidadeMedia(): FuncaoDados[] {
    const valoresDer: number[] = _.range(1, this.MAX_DER_DADOS);
    const valoresRlr: number[] = _.range(1, this.MAX_TR);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoDados.ALI, this.valoresDentroDeComplexidadeMediaDados,
      valoresDer, valoresRlr
    );
  }

  private static valoresDentroDeComplexidadeMediaDados(der: number, rlr: number): boolean {
    return (der < 20 && rlr > 5) ||
      ((der > 20 && der <= 50) && (rlr >= 2 && rlr <= 5)) ||
      (der > 50 && rlr === 1);
  }

  static criaALIsComplexidadeAlta(): FuncaoDados[] {
    const valoresDer: number[] = _.range(20, this.MAX_DER_DADOS);
    const valoresRlr: number[] = _.range(2, this.MAX_TR);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoDados.ALI, this.valoresDentroDeComplexidadeAltaDados,
      valoresDer, valoresRlr
    );
  }

  private static valoresDentroDeComplexidadeAltaDados(der: number, rlr: number): boolean {
    return ((der >= 20 && der <= 50) && rlr > 5) ||
      // TODO avaliar se quebra para somente rlr >= 2
      // decisão não tão imediata se decidir reutilizar 'linhas' e 'colunas'
      der > 50 && ((rlr >= 2 && rlr <= 5) || (rlr > 5));
  }

  static criaAIEsComplexidadeBaixa(): FuncaoDados[] {
    const valoresDer: number[] = _.range(1, 51);
    const valoresRlr: number[] = _.range(1, 6);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoDados.AIE, this.valoresDentroDeComplexidadeBaixaDados,
      valoresDer, valoresRlr
    );
  }

  static criaAIEsComplexidadeMedia(): FuncaoDados[] {
    const valoresDer: number[] = _.range(1, this.MAX_DER_DADOS);
    const valoresRlr: number[] = _.range(1, this.MAX_TR);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoDados.AIE, this.valoresDentroDeComplexidadeMediaDados,
      valoresDer, valoresRlr
    );
  }

  static criaAIEsComplexidadeAlta(): FuncaoDados[] {
    const valoresDer: number[] = _.range(20, this.MAX_DER_DADOS);
    const valoresRlr: number[] = _.range(2, this.MAX_TR);

    return this.criaFuncaoDadosComFatorAjustePercentualDentroDosIntervalos(
      TipoFuncaoDados.AIE, this.valoresDentroDeComplexidadeAltaDados,
      valoresDer, valoresRlr
    );
  }

}
