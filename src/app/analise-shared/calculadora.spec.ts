import { Calculadora } from './calculadora';
import { FuncaoDados, TipoFuncaoDados } from '../funcao-dados/funcao-dados.model';
import { MetodoContagem } from '../analise/index';
import { FatorAjuste, TipoFatorAjuste } from '../fator-ajuste/index';
import { Manual } from '../manual/index';

const fatorAjusteUnitario: FatorAjuste = criaFatorAjusteUnitario();
const fatorAjustePercentual: FatorAjuste = criaFatorAjustePercentual();

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
  const func = new FuncaoDados();
  func.tipo = TipoFuncaoDados.ALI;
  func.der = '5';
  func.rlr = '5';
  return func;
}

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

    funcaoDadosEntrada = criaFuncaoDadosALI();
    metodoContagem = 'INDICATIVA' as MetodoContagem;

    describe('ALI', () => {

      describe('Fator de Ajuste Unitário 2 PF', () => {

        beforeAll(() => {
          fatorAjuste = fatorAjusteUnitario;
          funcaoDadosEntrada.fatorAjuste = fatorAjuste;
        });

        beforeEach(() => {
          funcaoDadosCalculada = Calculadora.calcular(metodoContagem, funcaoDadosEntrada);
        });

        it('deve "zerar" DER', () => {
          expect(funcaoDadosCalculada.der).toEqual('0');
        });

        it('deve "zerar" RLR', () => {
          expect(funcaoDadosCalculada.rlr).toEqual('0');
        });

        it('deve ter PF bruto 35', () => {
          expect(funcaoDadosCalculada.grossPF).toEqual(35);
        });

        it ('deve ter PF líquido de acordo com fator', () => {
          // fator de ajuste unitario, pf é o valor do fator
          expect(funcaoDadosCalculada.pf).toEqual(fatorAjuste.fator);
        });
      });

      describe('Fator de Ajuste PERCENTUAL 50%', () => {

        beforeAll(() => {
          fatorAjuste = fatorAjustePercentual;
          funcaoDadosEntrada.fatorAjuste = fatorAjuste;
        });

        beforeEach(() => {
          funcaoDadosCalculada = Calculadora.calcular(metodoContagem, funcaoDadosEntrada);
        });

        it('deve "zerar" DER', () => {
          expect(funcaoDadosCalculada.der).toEqual('0');
        });

        it('deve "zerar" RLR', () => {
          expect(funcaoDadosCalculada.rlr).toEqual('0');
        });

        it('deve ter PF bruto 35', () => {
          expect(funcaoDadosCalculada.grossPF).toEqual(35);
        });

        it ('deve ter PF líquido de acordo com fator', () => {
          const valorLiquido: number = fatorAjuste.fator * funcaoDadosCalculada.grossPF;
          expect(funcaoDadosCalculada.pf).toEqual(valorLiquido);
        });

      });
    });
  });

});
