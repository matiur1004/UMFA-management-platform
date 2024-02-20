import {ArrayLengthPipe} from './array-length.pipe';

describe('ArrayLengthPipe', () => {
  it('create an instance', () => {
    const pipe = new ArrayLengthPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new ArrayLengthPipe();
    expect(pipe.transform(undefined)).toBe(0);
    expect(pipe.transform(null)).toBe(0);
  });

  it('input invalid types of data', () => {
    const pipe = new ArrayLengthPipe();
    expect(pipe.transform('hello')).toBe(0);
    expect(pipe.transform({})).toBe(0);
    expect(pipe.transform({a: 1, b: 2})).toBe(0);

    expect(pipe.transform(-123456789)).toBe(0);
    expect(pipe.transform(0)).toBe(0);
    expect(pipe.transform(123456789)).toBe(0);

    expect(pipe.transform(true)).toBe(0);
    expect(pipe.transform(false)).toBe(0);
  });

  it('input valid data', () => {
    const pipe = new ArrayLengthPipe();
    expect(pipe.transform([])).toBe(0);
    expect(pipe.transform([1, 2, 3, 4, 5, 6])).toBe(6);
    expect(pipe.transform(['hello', 'world'])).toBe(2);
    expect(pipe.transform([{a: 1}, {b: 2}, {c: 3}])).toBe(3);
  });

});
