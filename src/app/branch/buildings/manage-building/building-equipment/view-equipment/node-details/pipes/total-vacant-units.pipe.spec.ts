import {TotalVacantUnitsPipe} from './total-vacant-units.pipe';
import {UnitType} from '@models';

describe('TotalVacantUnitsPipe', () => {
  it('create an instance', () => {
    const pipe = new TotalVacantUnitsPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new TotalVacantUnitsPipe();
    expect(pipe.transform(null)).toEqual(0);
    expect(pipe.transform(undefined)).toEqual(0);
    expect(pipe.transform([])).toEqual(0);
  });

  it('input valid data', () => {
    const pipe = new TotalVacantUnitsPipe();
    const data = [{
      unitType: UnitType.Shop,
      tenantName: 'some tenant'
    }, {
      unitType: UnitType.Shop,
      tenantName: null
    }, {
      unitType: UnitType.CommonArea,
      tenantName: null
    }, {
      unitType: UnitType.CommonArea,
      tenantName: 'some tenant'
    }];
    expect(pipe.transform(data)).toEqual(2);
  });
});
