import { Calculadora } from '../calculadora';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';
import { MetodoContagem } from '../../analise/index';
import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/index';
import { Manual } from '../../manual/index';
import { Complexidade } from '../complexidade-enum';
import { CalculadoraSpecHelper } from './calculadora-spec-helper';

const fatorAjusteUnitario: FatorAjuste = criaFatorAjusteUnitario();
const fatorAjustePercentual: FatorAjuste = criaFatorAjustePercentual();

fdescribe('Calculadora', () => {

  let metodoContagem: MetodoContagem;
  let funcaoDadosEntrada: FuncaoDados;
  let fatorAjuste: FatorAjuste;
  let funcaoDadosCalculada: FuncaoDados;

  it('deve lançar erro se não houver um fator de ajuste', () => {
    expect(() => {
      Calculadora.calcular('DETALHADA' as MetodoContagem, new FuncaoDados());
    }).toThrowError();
  });

  describe('Método Contagem INDICATIVA', () => {

    beforeAll(() => {
      metodoContagem = 'INDICATIVA' as MetodoContagem;
    });

    describe('ALI', () => {

      beforeAll(() => {
        funcaoDadosEntrada = criaFuncaoDadosALI();
      });

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFatorAjuste(fatorAjusteUnitario).setPfBruto(35)
        .setPfLiquido(2).setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper, deveZerarDEReRLR);

      const percentualSpecHelper = new CalculadoraSpecHelper()
      .setFatorAjuste(fatorAjustePercentual).setPfBruto(35)
      .setPfLiquido(17.5).setComplexidade(Complexidade.SEM);
      testesEmComum(percentualSpecHelper, deveZerarDEReRLR);

    });

    function deveZerarDEReRLR() {
      it('deve "zerar" DER', () => {
        expect(funcaoDadosCalculada.der).toEqual('0');
      });

      it('deve "zerar" RLR', () => {
        expect(funcaoDadosCalculada.rlr).toEqual('0');
      });
    }

    describe('AIE', () => {

      beforeAll(() => {
        funcaoDadosEntrada = criaFuncaoDadosAIE();
      });

      const unitarioSpecHelper = new CalculadoraSpecHelper()
      .setFatorAjuste(fatorAjusteUnitario).setPfBruto(15)
      .setPfLiquido(2).setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper, deveZerarDEReRLR);

      const percentualSpecHelper = new CalculadoraSpecHelper()
      .setFatorAjuste(fatorAjustePercentual).setPfBruto(15)
      .setPfLiquido(7.5).setComplexidade(Complexidade.SEM);
      testesEmComum(percentualSpecHelper, deveZerarDEReRLR);
    });

  });

  function testesEmComum(specHelper: CalculadoraSpecHelper, ...fns: Function[]) {
    describe(`Fator de Ajuste ${specHelper.fatorAjusteLabel}`, () => {

      beforeAll(() => {
        fatorAjuste = specHelper.fatorAjuste;
        funcaoDadosEntrada.fatorAjuste = fatorAjuste;
      });

      beforeEach(() => {
        funcaoDadosCalculada = Calculadora.calcular(metodoContagem, funcaoDadosEntrada);
      });

      it(`deve ter PF bruto ${specHelper.pfBruto}`, () => {
        expect(funcaoDadosCalculada.grossPF).toEqual(specHelper.pfBruto);
      });

      it(`deve ter PF líquido ${specHelper.pfLiquido}`, () => {
        expect(funcaoDadosCalculada.pf).toEqual(specHelper.pfLiquido);
      });

      it(`deve ter Complexidade ${specHelper.complexidade}`, () => {
        expect(funcaoDadosCalculada.complexidade).toEqual(specHelper.complexidade);
      });

      fns.forEach(fn => fn());
    });
  }

});

function criaFatorAjusteUnitario(): FatorAjuste {
  const fa: FatorAjuste = new FatorAjuste();
  fa.nome = 'unitario';
  fa.fator = 2.0;
  fa.tipoAjuste = TipoFatorAjuste.UNITARIO;
  return fa;
}

function criaFatorAjustePercentual(): FatorAjuste {
  const fa: FatorAjuste = new FatorAjuste();
  fa.nome = 'percentual';
  fa.fator = 0.5;
  fa.tipoAjuste = TipoFatorAjuste.PERCENTUAL;
  return fa;
}

function criaFuncaoDadosALI(): FuncaoDados {
  return criaFuncaoDados(TipoFuncaoDados.ALI);
}

function criaFuncaoDados(tipo): FuncaoDados {
  const func = new FuncaoDados();
  func.tipo = tipo;
  func.der = '5';
  func.rlr = '5';
  return func;
}

function criaFuncaoDadosAIE(): FuncaoDados {
  return criaFuncaoDados(TipoFuncaoDados.AIE);
}
