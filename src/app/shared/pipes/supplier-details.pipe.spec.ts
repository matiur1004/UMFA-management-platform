import {SupplierDetailsPipe} from './supplier-details.pipe';

describe('SupplierDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new SupplierDetailsPipe();
    expect(pipe).toBeTruthy();
  });
  it('input invalid data', () => {
    const pipe = new SupplierDetailsPipe();
    expect(pipe.transform('', null)).toEqual('<span class="supply-name">N/A</span>');
    expect(pipe.transform('QWE', null)).toEqual('<span class="supply-name">N/A</span>');
    expect(pipe.transform(null, null)).toEqual('<span class="supply-name">N/A</span>');
    expect(pipe.transform('qwert', [])).toEqual('<span class="supply-name">N/A</span>');
  });
  it('input valid data', () => {
    const pipe = new SupplierDetailsPipe();
    expect(pipe.transform('qwert', [{
      id: 'qwert',
      name: 'SupplierName'
    }])).toEqual('<span class="supply-name" title="SupplierName">SupplierName</span>');
  });
});
