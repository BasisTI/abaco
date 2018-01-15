import { ActiveBooleanPipe } from './active-boolean.pipe';

describe('ActiveBooleanPipe', () => {
  it('create an instance', () => {
    const pipe = new ActiveBooleanPipe();
    expect(pipe).toBeTruthy();
  });
});
