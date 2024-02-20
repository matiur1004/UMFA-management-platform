import {TariffHasDuplicationFactorPipe} from './tariff-has-duplication-factor.pipe';

describe('TariffHasDuplicationFactorPipe', () => {
  it('create an instance', () => {
    const pipe = new TariffHasDuplicationFactorPipe();
    expect(pipe).toBeTruthy();
  });
  it('invalid data', () => {
    const pipe = new TariffHasDuplicationFactorPipe();
    expect(pipe.transform('qwert', [{id: 'no', entity: {lineItems: [{hasDuplicationFactor: true}]}}]))
      .toEqual(false);

    expect(pipe.transform('qwert', null)).toEqual(false);
    expect(pipe.transform('qwert', [])).toEqual(false);
    expect(pipe.transform('qwert', [null, {}])).toEqual(false);
  });
  it('tariff with duplication factor', () => {
    const pipe = new TariffHasDuplicationFactorPipe();
    expect(pipe.transform('qwert', [{id: 'qwert', entity: {lineItems: [{hasDuplicationFactor: true}]}}]))
      .toEqual(true);

    expect(pipe.transform('qwert', [{
      id: 'qwert', entity: {
        lineItems: [{hasDuplicationFactor: false}, {hasDuplicationFactor: true}]
      }
    }])).toEqual(true);
  });

  it('tariff without duplication factor', () => {
    const pipe = new TariffHasDuplicationFactorPipe();
    expect(pipe.transform('qwert', [{id: 'qwert', entity: {lineItems: [{hasDuplicationFactor: false}]}}]))
      .toEqual(false);
    expect(pipe.transform('qwert', [{id: 'qwert', entity: {lineItems: []}}]))
      .toEqual(false);
  });
});
