import { ComplexidadeFuncionalDados } from './complexidade-funcional-dados';
import { Complexidade } from '../complexidade-enum';

import * as _ from 'lodash';

describe('Complexidade Funcional de Função de Dados', () => {

  let complexidadeRetornada: Complexidade;

  describe('DER - para todo valor menor que 20', () => {

    const derValues: number[] = [];
    for (let i = 1; i < 20; i++) {
      derValues.push(i);
    }

    testesEmComum(derValues,
      Complexidade.BAIXA,
      Complexidade.BAIXA,
      Complexidade.MEDIA
    );
  });

  describe('DER - para todo valor maior ou igual a 20 e menor ou igual a 50', () => {

    const derValues: number[] = [];
    for (let i = 20; i <= 50; i++) {
      derValues.push(i);
    }

    testesEmComum(derValues,
      Complexidade.BAIXA,
      Complexidade.MEDIA,
      Complexidade.ALTA);

  });

  describe('DER - para valores maiores que 50', () => {

    const derValues: number[] = [51];
    for (let i = 0; i < 4; i ++) {
      derValues.push(randomIntFromInterval(52, 300));
    }
    const dersFormatados: string = _.join(derValues.sort(numberArraySort), ', ');

    describe(`valores ${dersFormatados}`, () => {
      testesEmComum(derValues,
        Complexidade.MEDIA,
        Complexidade.ALTA,
        Complexidade.ALTA);
    });

  });

  function testesEmComum(ders: number[],
    complexidade1: Complexidade, complexidade2: Complexidade,
    complexidade3: Complexidade) {

    describe('RLR igual a 1', () => {
      it(`complexidade deve ser ${complexidade1}`, () => {
        ders.forEach(derValue => {
          complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, 1);
          expect(complexidadeRetornada).toEqual(complexidade1);
        });
      });
    });

    describe('RLR para todo valor maior igual a 2 ou menor igual a 5', () => {

      const rlrValues = [];
      beforeAll(() => {
        for (let i = 2; i <= 5; i++) {
          rlrValues.push(i);
        }
      });

      it(`complexidade deve ser ${complexidade2} para todos RLR`, () => {
        ders.forEach(derValue => {
          rlrValues.forEach(rlrValue => {
            complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, rlrValue);
            expect(complexidadeRetornada).toEqual(complexidade2);
          });
        });
      });
    });

    describe('RLR maior que 5', () => {

      const rlrValues = [6];
      for (let i = 0; i < 5; i++) {
        rlrValues.push(randomIntFromInterval(6, 300));
      }
      rlrValues.sort(numberArraySort);

      rlrValues.forEach(rlrValue => {
        it(`complexidade deve ser ${complexidade3} para RLR ${rlrValue}`, () => {
          ders.forEach(derValue => {
            complexidadeRetornada = ComplexidadeFuncionalDados.calcular(derValue, rlrValue);
            expect(complexidadeRetornada).toEqual(complexidade3);
          });
        });
      });

    });

  }
});

function randomIntFromInterval(min, max): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function numberArraySort(a, b) {
  return a - b;
}
