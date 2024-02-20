import {LocationTypeDetailsPipe} from './location-type-details.pipe';

describe('LocationTypeDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new LocationTypeDetailsPipe();
    expect(pipe).toBeTruthy();
  });
  it('input invalid data', () => {
    const pipe = new LocationTypeDetailsPipe();
    expect(pipe.transform('', null)).toEqual('<span class="supply-name">N/A</span>');
    expect(pipe.transform('QWE', null)).toEqual('<span class="supply-name">N/A</span>');
    expect(pipe.transform(null, null)).toEqual('<span class="supply-name">N/A</span>');
    expect(pipe.transform('qwert', [])).toEqual('<span class="supply-name">N/A</span>');
    expect(pipe.transform('qwert', [{
      id: 'qwert',
      name: 'SupplierName'
    }])).toEqual('<span class="supply-name">N/A</span>');
  });
  it('input valid data', () => {
    const pipe = new LocationTypeDetailsPipe();
    expect(pipe.transform('qwert', [{locationTypes: []}])).toEqual('<span class="supply-name">N/A</span>');
    expect(pipe.transform('qwert', [{
      locationTypes: [{
        id: 'qwert',
        name: 'LocationDetails'
      }]
    }])).toEqual('<span class="supply-name" title="LocationDetails">LocationDetails</span>');
  });
});
