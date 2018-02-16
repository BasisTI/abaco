import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/index';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';

import * as _ from 'lodash';

export class CalculadoraTestData {

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
    const alisBaixa: FuncaoDados[] = [];
    const valoresDer: number[] = _.range(1, 51);
    const valoresRlr: number[] = _.range(1, 6);
    const fatorAjustePercentual: FatorAjuste = this.criaFatorAjustePercentual50();
    valoresDer.forEach(der => {
      valoresRlr.forEach(rlr => {
        if (this.valoresDentroDeComplexidadeBaixa(der, rlr)) {
          const aliBaixa = this.criaFuncaoDadosComValores(TipoFuncaoDados.ALI, der, rlr);
          aliBaixa.fatorAjuste = fatorAjustePercentual;
          alisBaixa.push(aliBaixa);
        }
      });
    });
    return alisBaixa;
  }

  private static valoresDentroDeComplexidadeBaixa(der: number, rlr: number) {
    return der < 20 || (der > 20 && rlr === 1);
  }

  static criaALIsComplexidadeMedia(): FuncaoDados[] {

  }

  static criaALIsComplexidadeAlta(): FuncaoDados[] {

  }

}
