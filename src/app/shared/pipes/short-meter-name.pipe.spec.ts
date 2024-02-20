import {ShortMeterNamePipe} from './short-meter-name.pipe';

describe('ShortMeterNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ShortMeterNamePipe();
    expect(pipe).toBeTruthy();
  });
  it('input invalid data', () => {
    const pipe = new ShortMeterNamePipe();
    expect(pipe.transform('', null)).toEqual('N/A-_');
    expect(pipe.transform('QWE', null)).toEqual('QWE-_');
    expect(pipe.transform(null, null)).toEqual('N/A-_');
  });
  it('input valid data', () => {
    const pipe = new ShortMeterNamePipe();
    expect(pipe.transform('SN123456', 0)).toEqual('3456-E');
    expect(pipe.transform('SN_POIU', 1)).toEqual('POIU-W');
    expect(pipe.transform('QU', 2)).toEqual('QU-G');
    expect(pipe.transform('QT', 3)).toEqual('QT-S');
    expect(pipe.transform('QA', 4)).toEqual('QA-A');
  });
});
