import {TotalAreaUnitsPipe} from './total-area-units.pipe';
import {UnitType} from '@models';

describe('TotalAreaUnitsPipe', () => {
  it('create an instance', () => {
    const pipe = new TotalAreaUnitsPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new TotalAreaUnitsPipe();
    expect(pipe.transform(null)).toEqual(0);
    expect(pipe.transform(undefined)).toEqual(0);
    expect(pipe.transform([])).toEqual(0);
  });

  it('input valid data', () => {
    const pipe = new TotalAreaUnitsPipe();
    const data = [{
      unitType: UnitType.Shop,
      area: 5
    }, {
      unitType: UnitType.Shop,
      area: 7
    }, {
      unitType: UnitType.CommonArea,
      area: 3
    }, {
      unitType: UnitType.CommonArea,
      area: null
    }];
    expect(pipe.transform(data)).toEqual(15);
  });
});
