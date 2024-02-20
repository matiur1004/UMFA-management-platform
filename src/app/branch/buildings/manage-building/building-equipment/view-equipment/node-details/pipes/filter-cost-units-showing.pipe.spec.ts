import {FilterCostUnitsShowingPipe} from './filter-cost-units-showing.pipe';
import {UnitType} from '@models';
import {NodeUnitFilter} from '../../../shared/models';

describe('FilterCostUnitsShowingPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterCostUnitsShowingPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new FilterCostUnitsShowingPipe();
    expect(pipe.transform(null, null)).toEqual([]);
    expect(pipe.transform([], null)).toEqual([]);
  });

  it('input valid data', () => {
    const pipe = new FilterCostUnitsShowingPipe();
    const data = [{
      unitType: UnitType.Shop,
      isLiable: true
    }, {
      unitType: UnitType.Shop,
      isLiable: false,
      tenantName: 'some tenant'
    }, {
      unitType: UnitType.CommonArea,
      isLiable: true
    }, {
      unitType: UnitType.CommonArea,
      isLiable: true
    }];
    expect(pipe.transform(data, NodeUnitFilter.AllUnits)).toEqual(data);

    expect(pipe.transform(data, NodeUnitFilter.LiableUnits)).toEqual([
      {
        unitType: UnitType.Shop,
        isLiable: true
      }, {
        unitType: UnitType.CommonArea,
        isLiable: true
      }, {
        unitType: UnitType.CommonArea,
        isLiable: true
      }
    ]);
    expect(pipe.transform(data, NodeUnitFilter.NotLiableUnits)).toEqual([
      {
        unitType: UnitType.Shop,
        isLiable: false,
        tenantName: 'some tenant'
      }
    ]);
    expect(pipe.transform(data, NodeUnitFilter.VacantShops)).toEqual([
      {
        unitType: UnitType.Shop,
        isLiable: true
      }
    ]);
  });
});
