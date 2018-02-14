import { Calculadora } from './calculadora';
import { FuncaoDados, TipoFuncaoDados } from '../funcao-dados/funcao-dados.model';
import { MetodoContagem } from '../analise/index';
import { FatorAjuste, TipoFatorAjuste } from '../fator-ajuste/index';
import { Manual } from '../manual/index';

const fatorAjusteUnitario: FatorAjuste = criaFatorAjusteUnitario();

const manual: Manual = criaManual();

function criaManual(): Manual {
  return undefined;
}

function criaFatorAjusteUnitario(): FatorAjuste {
  const fa: FatorAjuste = new FatorAjuste(undefined, 'unitario',
    2.0, true, 'unitario', 'codU', TipoFatorAjuste.UNITARIO,
    undefined, manual, undefined);
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
        fatorAjuste = criaFatorAjusteUnitario();
        funcaoDadosEntrada.fatorAjuste = fatorAjuste;

        it('deve "zerar" DER', () => {
          funcaoDadosCalculada = Calculadora.calcular(metodoContagem, funcaoDadosEntrada);
          expect(funcaoDadosCalculada.der).toEqual('0');
        });

        it('deve "zerar" RLR', () => {
          funcaoDadosCalculada = Calculadora.calcular(metodoContagem, funcaoDadosEntrada);
          expect(funcaoDadosCalculada.rlr).toEqual('0');
        });

        it('deve ter PF bruto 35', () => {
          funcaoDadosCalculada = Calculadora.calcular(metodoContagem, funcaoDadosEntrada);
          expect(funcaoDadosCalculada.grossPF).toEqual(35);
        });

        it ('deve ter PF líquido de acordo com fator', () => {
          funcaoDadosCalculada = Calculadora.calcular(metodoContagem, funcaoDadosEntrada);
          // fator de ajuste unitario, pf é o valor do fator
          expect(funcaoDadosCalculada.pf).toEqual(fatorAjuste.fator);
        });
      });
    });
  });

});
