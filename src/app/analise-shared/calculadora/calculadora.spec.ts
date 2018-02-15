import { Calculadora } from '../calculadora';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';
import { MetodoContagem } from '../../analise/index';
import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/index';
import { Manual } from '../../manual/index';
import { Complexidade } from '../complexidade-enum';
import { CalculadoraSpecHelper } from './calculadora-spec-helper';
import { CalculadoraTestData } from './calculadora-test-data';

const fatorAjusteUnitario: FatorAjuste = CalculadoraTestData.criaFatorAjusteUnitario();
const fatorAjustePercentual: FatorAjuste = CalculadoraTestData.criaFatorAjustePercentual();

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
        funcaoDadosEntrada = CalculadoraTestData.criaFuncaoDadosALI();
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
        funcaoDadosEntrada = CalculadoraTestData.criaFuncaoDadosAIE();
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
