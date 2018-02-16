import { CalculadoraTransacao } from '../calculadora-transacao';
import { FuncaoTransacao, TipoFuncaoTransacao } from '../../funcao-transacao/funcao-transacao.model';
import { MetodoContagem } from '../../analise/index';
import { FatorAjuste } from '../../fator-ajuste/index';
import { Complexidade } from '../complexidade-enum';
import { CalculadoraSpecHelper } from './calculadora-spec-helper';
import { CalculadoraTestData } from './calculadora-test-data';

const fatorAjusteUnitario2PF: FatorAjuste = CalculadoraTestData.criaFatorAjusteUnitario2PF();
const fatorAjustePercentual50: FatorAjuste = CalculadoraTestData.criaFatorAjustePercentual50();

fdescribe('Calculadora de Função de Transação', () => {

  let metodoContagem: MetodoContagem;
  let funcaoCalculada: FuncaoTransacao;

  describe('Método contagem INDICATIVA', () => {
    describe('Não deveria ser calculado', () => { });
  });

  describe('Método contagem ESTIMADA', () => {

    beforeAll(() => metodoContagem = 'ESTIMADA' as MetodoContagem);

    const ESTIMADA_PF_BRUTO_FATOR_AJUSTE_UNITARIO = 0;

    describe('EE', () => {
      const EE_ESTIMADA_PF_BRUTO = 4;

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoTransacaoEntrada(CalculadoraTestData.criaFuncaoTransacaoEE())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(ESTIMADA_PF_BRUTO_FATOR_AJUSTE_UNITARIO)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoTransacaoEntrada(CalculadoraTestData.criaFuncaoTransacaoEE())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(EE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.MEDIA);
      testesEmComum(percentualSpecHelper);
    });

    describe('SE', () => {
      const SE_ESTIMADA_PF_BRUTO = 5;

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoTransacaoEntrada(CalculadoraTestData.criaFuncaoTransacaoSE())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(ESTIMADA_PF_BRUTO_FATOR_AJUSTE_UNITARIO)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoTransacaoEntrada(CalculadoraTestData.criaFuncaoTransacaoSE())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(SE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.MEDIA);
      testesEmComum(percentualSpecHelper);
    });

    describe('CE', () => {
      const CE_ESTIMADA_PF_BRUTO = 4;

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoTransacaoEntrada(CalculadoraTestData.criaFuncaoTransacaoCE())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(ESTIMADA_PF_BRUTO_FATOR_AJUSTE_UNITARIO)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoTransacaoEntrada(CalculadoraTestData.criaFuncaoTransacaoCE())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(CE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.MEDIA);
      testesEmComum(percentualSpecHelper);
    });

  });

  describe('Método contagem DETALHADA', () => {

    beforeAll(() => metodoContagem = 'DETALHADA' as MetodoContagem);

    describe('EE', () => {
      describe('Complexidade BAIXA', () => {
        const EE_BAIXA_PF_BRUTO = 3;
        it(`todos os casos devem ter PF Bruto ${EE_BAIXA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaEEsComplexidadeBaixa(),
            EE_BAIXA_PF_BRUTO);
        });
      });

      describe('Complexidade MEDIA', () => {
        const EE_MEDIA_PF_BRUTO = 4;
        it(`todos os casos devem ter PF Bruto ${EE_MEDIA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaEEsComplexidadeMedia(),
            EE_MEDIA_PF_BRUTO);
        });
      });

      describe('Complexidade BAIXA', () => {
        const EE_ALTA_PF_BRUTO = 6;
        it(`todos os casos devem ter PF Bruto ${EE_ALTA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaEEsComplexidadeAlta(),
            EE_ALTA_PF_BRUTO);
        });
      });

    });

    describe('SE', () => {
      describe('Complexidade BAIXA', () => {
        const SE_BAIXA_PF_BRUTO = 4;
        it(`todos os casos devem ter PF Bruto ${SE_BAIXA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaSEsComplexidadeBaixa(),
            SE_BAIXA_PF_BRUTO);
        });
      });

      describe('Complexidade MEDIA', () => {
        const SE_MEDIA_PF_BRUTO = 5;
        it(`todos os casos devem ter PF Bruto ${SE_MEDIA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaSEsComplexidadeMedia(),
            SE_MEDIA_PF_BRUTO);
        });
      });

      describe('Complexidade ALTA', () => {
        const SE_ALTA_PF_BRUTO = 7;
        it(`todos os casos devem ter PF Bruto ${SE_ALTA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaSEsComplexidadeAlta(),
            SE_ALTA_PF_BRUTO);
        });
      });
    });

    describe('CE', () => {
      describe('Complexidade BAIXA', () => {
        const CE_BAIXA_PF_BRUTO = 3;
        it(`todos os casos devem ter PF Bruto ${CE_BAIXA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaCEsComplexidadeBaixa(),
            CE_BAIXA_PF_BRUTO);
        });
      });

      describe('Complexidade MEDIA', () => {
        const CE_MEDIA_PF_BRUTO = 4;
        it(`todos os casos devem ter PF Bruto ${CE_MEDIA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaCEsComplexidadeMedia(),
            CE_MEDIA_PF_BRUTO);
        });
      });

      describe('Complexidade ALTA', () => {
        const CE_ALTA_PF_BRUTO = 6;
        it(`todos os casos devem ter PF Bruto ${CE_ALTA_PF_BRUTO}`, () => {
          verificaPfBrutoDetalhada(
            CalculadoraTestData.criaCEsComplexidadeAlta(),
            CE_ALTA_PF_BRUTO);
        });
      });
    });

    function verificaPfBrutoDetalhada(funcoes: FuncaoTransacao[], pfBrutoEsperado: number) {
      funcoes.forEach(funcao => {
        const funcCalculada: FuncaoTransacao =
          CalculadoraTransacao.calcular(metodoContagem, funcao);
        expect(funcCalculada.grossPF).toEqual(pfBrutoEsperado);
      });
    }

  });

  // TODO DUPLICADO com calculadora de funcao dados
  function testesEmComum(specHelper: CalculadoraSpecHelper, ...fns: Function[]) {
    describe(`Fator de Ajuste ${specHelper.fatorAjusteLabel}`, () => {

      describe(specHelper.descricaoDaFuncao, () => {

        beforeEach(() => {
          funcaoCalculada = CalculadoraTransacao.calcular(metodoContagem, specHelper.funcaoTransacaoEntrada);
        });

        it(`deve ter PF bruto ${specHelper.pfBruto}`, () => {
          expect(funcaoCalculada.grossPF).toEqual(specHelper.pfBruto);
        });

        it(`deve ter PF líquido ${specHelper.calculaPfLiquido()}`, () => {
          expect(funcaoCalculada.pf).toEqual(specHelper.calculaPfLiquido());
        });

        it(`deve ter Complexidade ${specHelper.complexidade}`, () => {
          expect(funcaoCalculada.complexidade).toEqual(specHelper.complexidade);
        });

        fns.forEach(fn => fn());

      });

    });
  }

});
