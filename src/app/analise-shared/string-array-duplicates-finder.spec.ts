import { DuplicatesResult, StringArrayDuplicatesFinder } from './string-array-duplicates-finder';

fdescribe('StringArrayDuplicatesFinder', () => {

  it('deve retornar com mais de um valor duplicado', () => {
    const valores: String[] = ['a', 'a', 'a'];
    const result: DuplicatesResult = StringArrayDuplicatesFinder.find(valores);

    expect(result.duplicados).toContain('a');
    expect(result.temDuplicatas()).toBe(true);
  });

  it('não deve retornar valores quando não tem duplicatas', () => {
    const valores = ['a', 'b', 'c'];
    const result: DuplicatesResult = StringArrayDuplicatesFinder.find(valores);

    expect(result.duplicados.length).toEqual(0);
    expect(result.temDuplicatas()).toBeFalsy();
  });

  it('deve retornar diversos valores duplicados', () => {
    const valores = ['a', 'b', 'a', 'c', 'd', 'b', 'c', 'e'];
    const result: DuplicatesResult = StringArrayDuplicatesFinder.find(valores);

    expect(result.duplicados.length).toEqual(3);
    expect(result.temDuplicatas()).toBe(true);
  });

});
