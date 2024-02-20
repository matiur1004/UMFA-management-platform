import {TimeOfUseNamePipe} from './time-of-use-name.pipe';
import {TimeOfUseName} from '../models/time-of-use.model';

const mockData = [0, 3, 6, 'bad tou value', null, -2];

describe('TimeOfUseNamePipe', () => {
  const pipe = new TimeOfUseNamePipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('test default value', () => {
    expect(pipe.transform(mockData[0])).toBe('');
  });
  it('test correct string value', () => {
    expect(pipe.transform(mockData[1])).toBe(TimeOfUseName[3]);
  });
  it('test incorrect number value', () => {
    expect(pipe.transform(mockData[2])).toBe('');
  });
  it('test incorrect string value', () => {
    expect(pipe.transform(mockData[3])).toBe('');
  });
  it('test null value', () => {
    expect(pipe.transform(mockData[4])).toBe('');
  });
  it('test incorrect negative number value', () => {
    expect(pipe.transform(mockData[5])).toBe('');
  });
});
