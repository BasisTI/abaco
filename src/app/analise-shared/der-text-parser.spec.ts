import { ParseResult, DerTextParser } from './der-text-parser';
import * as _ from 'lodash';

describe('DerTextParser', () => {

  describe('entrada númerica', () => {

    const entrada = '10';
    let result: ParseResult;

    beforeEach(() => {
      result = DerTextParser.parse(entrada);
    });

    it(`deve retornar um ParseResult com tipo 'NUMERO'`, () => {
      expect(result.tipo).toEqual(ParseResult.NUMERO_TIPO);
    });

    it(`'numero' deve ser um number`, () => {
      expect(result.numero).toEqual(jasmine.any(Number));
    });

    it(`deve retornar 'numero' com o valor correto`, () => {
      expect(result.numero).toEqual(10);
    });

  });

  describe('entrada textual', () => {

    let result: ParseResult;
    const entrada = `linha 1
        linha 2
        linha 3`;

    beforeEach(() => {
      result = DerTextParser.parse(entrada);
    });

    it(`deve retornar um ParseResult com tipo 'TEXTO'`, () => {
      expect(result.tipo).toEqual(ParseResult.TEXTO_TIPO);
    });

    it('deve quebrar cada linha em um valor', () => {
      expect(result.textos.length).toEqual(3);
    });

    it('deve conter cada linha com valor correto', () => {
      expectToContainExactly(result.textos, 'linha 1', 'linha 2', 'linha 3');
    });

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

});
