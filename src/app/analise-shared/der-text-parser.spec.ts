import { ParseResult, DerTextParser } from './der-text-parser';
import * as _ from 'lodash';

fdescribe('DerTextParser', () => {

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

});
