import {TotalLiableUnitsPipe} from './total-liable-units.pipe';
import {UnitType} from '@models';

describe('TotalLiableUnitsPipe', () => {
  it('create an instance', () => {
    const pipe = new TotalLiableUnitsPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new TotalLiableUnitsPipe();
    expect(pipe.transform(null, null)).toEqual(0);
    expect(pipe.transform(undefined, null)).toEqual(0);
    expect(pipe.transform([], null)).toEqual(0);
    expect(pipe.transform([], true)).toEqual(0);
  });

  it('input valid data', () => {
    const pipe = new TotalLiableUnitsPipe();
    const data = [{
      unitType: UnitType.Shop,
      isLiable: true
    }, {
      unitType: UnitType.Shop,
      isLiable: false
    }, {
      unitType: UnitType.CommonArea,
      isLiable: true
    }, {
      unitType: UnitType.CommonArea,
      isLiable: true
    }];
    expect(pipe.transform(data, null)).toEqual(0);
    expect(pipe.transform(data, true)).toEqual(3);
    expect(pipe.transform(data, false)).toEqual(1);
  });
});
