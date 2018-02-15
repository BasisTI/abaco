import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/index';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';

export class CalculadoraTestData {

  static criaFatorAjusteUnitario(): FatorAjuste {
    const fa: FatorAjuste = new FatorAjuste();
    fa.nome = 'unitario';
    fa.fator = 2.0;
    fa.tipoAjuste = TipoFatorAjuste.UNITARIO;
    return fa;
  }

  static criaFatorAjustePercentual(): FatorAjuste {
    const fa: FatorAjuste = new FatorAjuste();
    fa.nome = 'percentual';
    fa.fator = 0.5;
    fa.tipoAjuste = TipoFatorAjuste.PERCENTUAL;
    return fa;
  }

  static criaFuncaoDadosALI(): FuncaoDados {
    return this.criaFuncaoDados(TipoFuncaoDados.ALI);
  }

  static criaFuncaoDados(tipo): FuncaoDados {
    const func = new FuncaoDados();
    func.tipo = tipo;
    func.der = '5';
    func.rlr = '5';
    return func;
  }

  static criaFuncaoDadosAIE(): FuncaoDados {
    return this.criaFuncaoDados(TipoFuncaoDados.AIE);
  }

}
