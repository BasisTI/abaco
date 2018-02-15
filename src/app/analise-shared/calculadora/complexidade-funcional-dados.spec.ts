import { ComplexidadeFuncionalDados } from './complexidade-funcional-dados';
import { Complexidade } from '../complexidade-enum';

fdescribe('Complexidade Funcional de função de Dados', () => {

  let derValues: number[] = [];
  let complexidadeRetornada: Complexidade;

  describe('DER para todos valores menor que 20', () => {

    derValues = [];
    for (let i = 1; i < 20; i++) {
      derValues.push(i);
    }

    describe('RLR igual a 1', () => {
      it(`complexidade deve ser BAIXA`, () => {
        derValues.forEach(derValue => {
          complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, 1);
          expect(complexidadeRetornada).toEqual(Complexidade.BAIXA);
        });
      });
    });

    describe('RLR maior igual a 2 ou menor igual a 5', () => {

      const rlrValues = [];
      beforeAll(() => {
        for (let i = 2; i <= 5; i++) {
          rlrValues.push(i);
        }
      });

      it(`complexidade deve ser BAIXA para todos RLR`, () => {
        derValues.forEach(derValue => {
          rlrValues.forEach(rlrValue => {
            complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, rlrValue);
            expect(complexidadeRetornada).toEqual(Complexidade.BAIXA);
          });
        });
      });
    });

    describe('RLR maior que 5', () => {

      const rlrValues = [6];
      for (let i = 0; i < 5; i++) {
        rlrValues.push(randomIntFromInterval(6, 300));
      }
      rlrValues.sort((a, b) => a - b);

      rlrValues.forEach(rlrValue => {
        it(`complexidade deve ser MEDIA para RLR ${rlrValue}`, () => {
          derValues.forEach(derValue => {
            complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, rlrValue);
            expect(complexidadeRetornada).toEqual(Complexidade.MEDIA);
          });
        });
      });

    });
  });

});

function randomIntFromInterval(min, max): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
