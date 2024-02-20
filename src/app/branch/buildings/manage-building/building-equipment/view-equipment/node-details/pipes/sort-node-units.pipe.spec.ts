import {SortNodeUnitsPipe} from './sort-node-units.pipe';
import {UnitType} from '@models';

describe('SortNodeUnitsPipe', () => {
  it('create an instance', () => {
    const pipe = new SortNodeUnitsPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new SortNodeUnitsPipe();
    expect(pipe.transform(null, null)).toEqual([]);
    expect(pipe.transform([], null)).toEqual([]);
    expect(pipe.transform([], 'name')).toEqual([]);
  });

  it('input valid data', () => {
    const pipe = new SortNodeUnitsPipe();
    const data = [{
      name: 'Shop T',
      unitType: UnitType.Shop,
      area: 5
    }, {
      name: 'Shop A',
      unitType: UnitType.Shop,
      area: 7
    }, {
      name: 'Area G',
      unitType: UnitType.CommonArea,
      area: 5
    }, {
      name: 'Area H',
      unitType: UnitType.CommonArea,
      area: null
    }];
    expect(pipe.transform(data, 'name')).toEqual([
      {
        name: 'Area G',
        unitType: UnitType.CommonArea,
        area: 5
      }, {
        name: 'Area H',
        unitType: UnitType.CommonArea,
        area: null
      }, {
        name: 'Shop A',
        unitType: UnitType.Shop,
        area: 7
      },
      {
        name: 'Shop T',
        unitType: UnitType.Shop,
        area: 5
      }
    ]);
    expect(pipe.transform(data, 'name', -1)).toEqual([
      {
        name: 'Shop T',
        unitType: UnitType.Shop,
        area: 5
      }, {
        name: 'Shop A',
        unitType: UnitType.Shop,
        area: 7
      }, {
        name: 'Area H',
        unitType: UnitType.CommonArea,
        area: null
      },
      {
        name: 'Area G',
        unitType: UnitType.CommonArea,
        area: 5
      }

    ]);

    expect(pipe.transform(data, 'area', 1)).toEqual([
      {
        name: 'Area H',
        unitType: UnitType.CommonArea,
        area: null
      },
      {
        name: 'Shop T',
        unitType: UnitType.Shop,
        area: 5
      },
      {
        name: 'Area G',
        unitType: UnitType.CommonArea,
        area: 5
      }, {
        name: 'Shop A',
        unitType: UnitType.Shop,
        area: 7
      }

    ]);
  });
});
