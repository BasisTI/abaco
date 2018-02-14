import { IntToFloatParser } from './int-to-float-parser';

describe ('IntToFloatParser', () => {

  describe('given an integer', () => {
    it('should return the number as string with .0 at the end', () => {
      const result: string = IntToFloatParser.parse(2);
      expect(result).toEqual('2.0');
    });
  });

  describe('given a float', () => {
    it('should return the same number as string', () => {
      const result: string = IntToFloatParser.parse(5.5);
      expect(result).toEqual('5.5');
    });
  });

});
