import {ParseNumberPipe} from './parse-number.pipe';

describe('ParseNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new ParseNumberPipe();
    expect(pipe).toBeTruthy();
  });

  it('input invalid data', () => {
    const pipe = new ParseNumberPipe();
    expect(pipe.transform(null)).toEqual(0);
    expect(pipe.transform(undefined)).toEqual(0);
    expect(pipe.transform(new Date())).toEqual(0);
    expect(pipe.transform('qwe')).toEqual(0);
  });

  it('input valid data', () => {
    const pipe = new ParseNumberPipe();
    expect(pipe.transform(123)).toEqual(123);
    expect(pipe.transform(123.456)).toEqual(123.456);
    expect(pipe.transform('1,123')).toEqual(1);
    expect(pipe.transform('1.123')).toEqual(1.123);
  });
});
