import { Calculadora } from '../calculadora';
import { FuncaoDados, TipoFuncaoDados } from '../../funcao-dados/funcao-dados.model';
import { MetodoContagem } from '../../analise/index';
import { FatorAjuste, TipoFatorAjuste } from '../../fator-ajuste/index';
import { Manual } from '../../manual/index';
import { Complexidade } from '../complexidade-enum';
import { CalculadoraSpecHelper } from './calculadora-spec-helper';
import { CalculadoraTestData } from './calculadora-test-data';

const fatorAjusteUnitario2PF: FatorAjuste = CalculadoraTestData.criaFatorAjusteUnitario2PF();
const fatorAjustePercentual50: FatorAjuste = CalculadoraTestData.criaFatorAjustePercentual50();

fdescribe('Calculadora de Função de Dados', () => {

  let metodoContagem: MetodoContagem;
  let funcaoDadosCalculada: FuncaoDados;

  it('deve lançar erro se não houver um fator de ajuste', () => {
    expect(() => {
      Calculadora.calcular('DETALHADA' as MetodoContagem, new FuncaoDados());
    }).toThrowError();
  });

  describe('Método Contagem INDICATIVA', () => {

    beforeAll(() => metodoContagem = 'INDICATIVA' as MetodoContagem);

    describe('ALI', () => {

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoEntrada(CalculadoraTestData.criaFuncaoDadosALI())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(35)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper, deveZerarDEReRLR);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoEntrada(CalculadoraTestData.criaFuncaoDadosALI())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(35)
        .setComplexidade(Complexidade.SEM);
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

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoEntrada(CalculadoraTestData.criaFuncaoDadosAIE())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(15)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper, deveZerarDEReRLR);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoEntrada(CalculadoraTestData.criaFuncaoDadosAIE())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(15)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(percentualSpecHelper, deveZerarDEReRLR);
    });
  });

  describe('Método Contagem ESTIMADA', () => {

    beforeAll(() => metodoContagem = 'ESTIMADA' as MetodoContagem);

    describe('ALI', () => {

      const ALI_ESTIMADA_PF_BRUTO = 7;

      // FATOR de ajuste unitário sempre vai ter Complexidade 'SEM'
      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoEntrada(CalculadoraTestData.criaFuncaoDadosALI())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(ALI_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoEntrada(CalculadoraTestData.criaFuncaoDadosALI())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(ALI_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.BAIXA);
      testesEmComum(percentualSpecHelper);

    });

    describe('AIE', () => {

      const AIE_ESTIMADA_PF_BRUTO = 5;

      // FATOR de ajuste unitário sempre vai ter Complexidade 'SEM'
      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoEntrada(CalculadoraTestData.criaFuncaoDadosAIE())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(AIE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoEntrada(CalculadoraTestData.criaFuncaoDadosAIE())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(AIE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.BAIXA);
      testesEmComum(percentualSpecHelper);

    });
  });

  describe('Método Contagem DETALHADA', () => {

    beforeAll(() => metodoContagem = 'DETALHADA' as MetodoContagem);

    describe('ALI', () => {
      describe('Complexidade BAIXA', () => {
        const ALI_BAIXA_PF_BRUTO = 7;
        it(`todos os casos devem ter PF Bruto '${ALI_BAIXA_PF_BRUTO}'`, () => {
          CalculadoraTestData.criaALIsComplexidadeBaixa().forEach(aliBaixa => {
            const funcaoCalculada: FuncaoDados =
              Calculadora.calcular(metodoContagem, aliBaixa);
            expect(funcaoCalculada.grossPF).toEqual(ALI_BAIXA_PF_BRUTO);
          });
        });
      });

      describe('Complexidade MEDIA', () => {
        const ALI_MEDIA_PF_BRUTO = 10;
        it(`todos os casos devem ter PF Bruto '${ALI_MEDIA_PF_BRUTO}'`, () => {
          CalculadoraTestData.criaALIsComplexidadeMedia().forEach(aliMedia => {
            const funcaoCalculada: FuncaoDados =
              Calculadora.calcular(metodoContagem, aliMedia);
            expect(funcaoCalculada.grossPF).toEqual(ALI_MEDIA_PF_BRUTO);
          });
        });
      });

      describe('Complexidade ALTA', () => {
        const ALI_ALTA_PF_BRUTO = 15;
        it(`todos os casos devem ter PF Bruto '${ALI_ALTA_PF_BRUTO}'`, () => {
          CalculadoraTestData.criaALIsComplexidadeAlta().forEach(aliAlta => {
            const funcaoCalculada: FuncaoDados =
              Calculadora.calcular(metodoContagem, aliAlta);
            expect(funcaoCalculada.grossPF).toEqual(ALI_ALTA_PF_BRUTO);
          });
        });
      });
    });

    describe('AIE', () => {

      describe('Complexidade BAIXA', () => {
        const AIE_BAIXA_PF_BRUTO = 5;
        it(`todos os casos devem ter PF Bruto '${AIE_BAIXA_PF_BRUTO}'`, () => {
          CalculadoraTestData.criaAIEsComplexidadeBaixa().forEach(aliBaixa => {
            const funcaoCalculada: FuncaoDados =
              Calculadora.calcular(metodoContagem, aliBaixa);
            expect(funcaoCalculada.grossPF).toEqual(AIE_BAIXA_PF_BRUTO);
          });
        });
      });

      describe('Complexidade MEDIA', () => {
        const AIE_MEDIA_PF_BRUTO = 7;
        it(`todos os casos devem ter PF Bruto '${AIE_MEDIA_PF_BRUTO}'`, () => {
          CalculadoraTestData.criaAIEsComplexidadeMedia().forEach(aliMedia => {
            const funcaoCalculada: FuncaoDados =
              Calculadora.calcular(metodoContagem, aliMedia);
            expect(funcaoCalculada.grossPF).toEqual(AIE_MEDIA_PF_BRUTO);
          });
        });
      });

      describe('Complexidade ALTA', () => {
        const AIE_ALTA_PF_BRUTO = 10;
        it(`todos os casos devem ter PF Bruto '${AIE_ALTA_PF_BRUTO}'`, () => {
          CalculadoraTestData.criaAIEsComplexidadeAlta().forEach(aliAlta => {
            const funcaoCalculada: FuncaoDados =
              Calculadora.calcular(metodoContagem, aliAlta);
            expect(funcaoCalculada.grossPF).toEqual(AIE_ALTA_PF_BRUTO);
          });
        });
      });
    });

  });

  function testesEmComum(specHelper: CalculadoraSpecHelper, ...fns: Function[]) {
    describe(`Fator de Ajuste ${specHelper.fatorAjusteLabel}`, () => {

      describe(specHelper.descricaoDaFuncao, () => {

        beforeEach(() => {
          funcaoDadosCalculada = Calculadora.calcular(metodoContagem, specHelper.funcaoEntrada);
        });

        it(`deve ter PF bruto ${specHelper.pfBruto}`, () => {
          expect(funcaoDadosCalculada.grossPF).toEqual(specHelper.pfBruto);
        });

        it(`deve ter PF líquido ${specHelper.calculaPfLiquido()}`, () => {
          expect(funcaoDadosCalculada.pf).toEqual(specHelper.calculaPfLiquido());
        });

        it(`deve ter Complexidade ${specHelper.complexidade}`, () => {
          expect(funcaoDadosCalculada.complexidade).toEqual(specHelper.complexidade);
        });

        fns.forEach(fn => fn());

      });

    });
  }
});
