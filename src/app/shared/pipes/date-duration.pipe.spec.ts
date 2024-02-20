import {DateDurationPipe} from './date-duration.pipe';

describe('ArrayLengthPipe', () => {
  it('create an instance', () => {
    const pipe = new DateDurationPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new DateDurationPipe();
    expect(pipe.transform(undefined)).toBe('0 days');
    expect(pipe.transform(null)).toBe('0 days');
  });

  it('input valid data', () => {
    const pipe = new DateDurationPipe();
    expect(pipe.transform(15)).toBe('15 days');
    expect(pipe.transform(36)).toBe('1 months 5 days');
    expect(pipe.transform(89)).toBe('2 months 29 days');
    expect(pipe.transform(420)).toBe('1 years 1 months 23 days');
  });

});
