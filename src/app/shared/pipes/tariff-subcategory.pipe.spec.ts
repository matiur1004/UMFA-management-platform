import {TariffSubcategoryPipe} from './tariff-subcategory.pipe';

describe('TariffSubcategoryPipe', () => {
  it('create an instance', () => {
    const pipe = new TariffSubcategoryPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new TariffSubcategoryPipe();
    expect(pipe.transform(null, null)).toEqual(null);
  });

  it('input valid data', () => {
    const pipe = new TariffSubcategoryPipe();
    expect(pipe.transform([{id: 1, isRecommended: false}, {id: 2, isRecommended: true}], false)).toEqual([{
      id: 1,
      isRecommended: false
    }]);
    expect(pipe.transform([{id: 1, isRecommended: false}, {id: 2, isRecommended: true}], true)).toEqual([{
      id: 2,
      isRecommended: true
    }]);
  });
});
