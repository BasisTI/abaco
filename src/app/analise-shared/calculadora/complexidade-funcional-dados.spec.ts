import { ComplexidadeFuncionalDados } from './complexidade-funcional-dados';
import { Complexidade } from '../complexidade-enum';

fdescribe('Complexidade Funcional de função de Dados', () => {

  let derValues: number[] = [];
  let rlrValues: number[] = [];
  let complexidadeRetornada: Complexidade;

  describe('DER menor que 20', () => {

    derValues = [];
    for (let i = 1; i <= 20; i++) {
      derValues.push(i);
    }

    derValues.forEach(derValue => {
      describe(`DER igual a ${derValue}`, () => {
        describe('RLR igual a 1', () => {
          it(`complexidade deve ser BAIXA`, () => {
            complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, 1);
            expect(complexidadeRetornada).toEqual(Complexidade.BAIXA);
          });
        });

        describe('RLR maior igual a 2 ou menor igual a 5', () => {

          rlrValues = [];
          for (let i = 2; i <= 5; i++) {
            rlrValues.push(i);
          }

          rlrValues.forEach(rlrValue => {
            it(`complexidade deve ser BAIXA para RLR ${rlrValue}`, () => {
              complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, rlrValue);
              expect(complexidadeRetornada).toEqual(Complexidade.BAIXA);
            });
          });
        });

        describe('RLR maior que 5', () => {

          rlrValues = [6];
          for (let i = 0; i < 10; i++) {
            rlrValues.push(randomIntFromInterval(6, 300));
          }

          rlrValues.forEach(rlrValue => {
            it(`complexidade deve ser MEDIA para RLR ${rlrValue}`, () => {
              complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, rlrValue);
              expect(complexidadeRetornada).toEqual(Complexidade.MEDIA);
            });
          });

        });
      });
    });

  });

});

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
