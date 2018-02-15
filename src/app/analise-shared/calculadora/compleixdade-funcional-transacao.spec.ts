import { ComplexidadeFuncionalTransacao } from './complexidade-funcional-transacao';
import { Complexidade } from '../complexidade-enum';

import * as _ from 'lodash';
import { TipoFuncaoTransacao } from '../../funcao-transacao/funcao-transacao.model';
import { NOTIMP } from 'dns';

fdescribe('Complexidade Funcional de Função de Transação', () => {

  let complexidadeRetornada: Complexidade;

  describe('TipoFuncaoTransacao EE', () => {

    describe('DER - para todo valor menor que 5', () => {

      const derValues: number[] = [];
      for (let i = 1; i < 5; i++) {
        derValues.push(i);
      }

      testesEmComumEE(derValues,
        Complexidade.BAIXA,
        Complexidade.BAIXA,
        Complexidade.MEDIA);

    });

    describe('DER - para todo valor maior ou igual a 5 e menor ou igual a 15', () => {

      const derValues: number[] = [];
      for (let i = 5; i <= 15; i++) {
        derValues.push(i);
      }

      testesEmComumEE(derValues,
        Complexidade.BAIXA,
        Complexidade.MEDIA,
        Complexidade.ALTA);
    });

    describe('DER - para valores maiores que 15', () => {

      const derValues: number[] = [16];
      for (let i = 0; i < 4; i++) {
        derValues.push(randomIntFromInterval(17, 100));
      }
      const dersFormatados: string = _.join(derValues.sort(numberArraySort), ', ');

      describe(`valores ${dersFormatados}`, () => {
        testesEmComumEE(derValues,
          Complexidade.MEDIA,
          Complexidade.ALTA,
          Complexidade.ALTA);
      });

    });
  });

  function testesEmComumEE(ders: number[],
    complexidade1: Complexidade, complexidade2: Complexidade,
    complexidade3: Complexidade) {

    describe('FTR menor que 2', () => {
      it(`complexidade deve ser ${complexidade1}`, () => {
        ders.forEach(derValue => {
          complexidadeRetornada = ComplexidadeFuncionalTransacao
            .calcular(TipoFuncaoTransacao.EE, derValue, 1);
          expect(complexidadeRetornada).toEqual(complexidade1);
        });
      });
    });

    describe('FTR igual a 2', () => {
      it(`complexidade deve ser ${complexidade2}`, () => {
        ders.forEach(derValue => {
          complexidadeRetornada = ComplexidadeFuncionalTransacao
            .calcular(TipoFuncaoTransacao.EE, derValue, 2);
          expect(complexidadeRetornada).toEqual(complexidade2);
        });
      });
    });

    describe('FTR maior que 2', () => {

      const ftrValues: number[] = [3];
      beforeAll(() => {
        for (let i = 0; i < 4; i++) {
          ftrValues.push(randomIntFromInterval(3, 100));
        }
      });
      ftrValues.sort(numberArraySort);
      console.log(ftrValues);

      ftrValues.forEach(ftrValue => {
        it(`complexidade deve ser ${complexidade3} para FTR ${ftrValue}`, () => {
          ders.forEach(derValue => {
            complexidadeRetornada = ComplexidadeFuncionalTransacao
              .calcular(TipoFuncaoTransacao.EE, derValue, ftrValue);
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
