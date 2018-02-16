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

    describe('EE', () => {
      const EE_ESTIMADA_PF_BRUTO = 4;

      const unitarioSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoTransacaoEntrada(CalculadoraTestData.criaFuncaoTransacaoEE())
        .setFatorAjuste(fatorAjusteUnitario2PF)
        .setPfBruto(EE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.SEM);
      testesEmComum(unitarioSpecHelper);

      const percentualSpecHelper = new CalculadoraSpecHelper()
        .setFuncaoTransacaoEntrada(CalculadoraTestData.criaFuncaoTransacaoEE())
        .setFatorAjuste(fatorAjustePercentual50)
        .setPfBruto(EE_ESTIMADA_PF_BRUTO)
        .setComplexidade(Complexidade.MEDIA);
      testesEmComum(percentualSpecHelper);

    });

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
