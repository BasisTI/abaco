import { ParseResult, DerTextParser } from './der-text-parser';
import * as _ from 'lodash';

describe('DerTextParser', () => {

  let result: ParseResult;

  describe('entrada númerica', () => {

    describe('0', () => {
      it('ParseResult mostraTotal() deve retornar 0', () => {
        result = DerTextParser.parse('0');
        expect(result.mostraTotal()).toEqual('0');
      });

    });

    const entrada = '10';

    beforeEach(() => {
      result = DerTextParser.parse(entrada);
    });

    expectResultTipoToBe(ParseResult.NUMERO_TIPO);

    it(`'numero' deve ser um number`, () => {
      expect(result.numero).toEqual(jasmine.any(Number));
    });

    it(`deve retornar 'numero' com o valor correto`, () => {
      expect(result.numero).toEqual(10);
    });

  });

  describe('entrada textual', () => {

    describe('1 linha em branco', () => {
      const entrada = '';

      beforeEach(() => result = DerTextParser.parse(entrada));

      expectResultTipoToBe(ParseResult.TEXTO_TIPO);

      it(`deve retornar 'textos' com tamanho 0`, () => {
        expect(result.textos.length).toEqual(0);
      });
    });

    describe('linhas em branco', () => {
      describe('no final', () => {
        const entrada = 'a\nb\nc\nd\ne\n';

        beforeEach(() => result = DerTextParser.parse(entrada));

        expectResultTipoToBe(ParseResult.TEXTO_TIPO);

        it(`deve remover linha em branco`, () => {
          expect(result.textos.length).toEqual(5);
          expect(result.textos).not.toContain('');
        });
      });

      describe('em diversas posições', () => {
        const entrada = '\na\nb\nc\n\nd\n\n\ne';

        beforeEach(() => result = DerTextParser.parse(entrada));

        expectResultTipoToBe(ParseResult.TEXTO_TIPO);

        it(`deve remover linhas em branco`, () => {
          expect(result.textos.length).toEqual(5);
          expect(result.textos).not.toContain('');
        });
      });
    });

    describe('1 linha', () => {
      const entrada = 'uma única linha';

      beforeEach(() => result = DerTextParser.parse(entrada));

      expectResultTipoToBe(ParseResult.TEXTO_TIPO);

      it(`deve retornar 'textos' com tamanho 1`, () => {
        expect(result.textos.length).toEqual(1);
      });

      it(`deve retornar o único valor corretamente`, () => {
        expect(result.textos).toContain(entrada);
      });

    });

    describe('3 linhas', () => {
      const entrada = `linha 1
      linha 2
      linha 3`;

      beforeEach(() => {
        result = DerTextParser.parse(entrada);
      });

      expectResultTipoToBe(ParseResult.TEXTO_TIPO);

      it('deve quebrar cada linha em um valor', () => {
        expect(result.textos.length).toEqual(3);
      });

      it('deve conter cada linha com valor correto', () => {
        expectToContainExactly(result.textos, 'linha 1', 'linha 2', 'linha 3');
      });
    });

  });

  describe('duplicatas', () => {

    it('deve retornar false para entrada númerica', () => {
      const entrada = '10';
      result = DerTextParser.parse(entrada);
      expect(result.temDuplicatas()).toBeFalsy();
    });

  });

  function expectResultTipoToBe(tipo: string) {
    it(`deve retornar um ParseResult com tipo '${tipo}'`, () => {
      expect(result.tipo).toEqual(tipo);
    });
  }

});


function expectToContainExactly(arr, ...values) {
  expect(arr.length).toEqual(values.length);
  doExpectToContain(arr, values);
}

function doExpectToContain(arr, values) {
  for (const value of values) {
    expect(arr).toContain(value);
  }

}
