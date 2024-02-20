import {FilterUnitsShowingPipe} from './filter-units-showing.pipe';
import {UnitFilter} from '../../../shared/models';

describe('FilterUnitsShowingPipe', () => {
  const data = [
    {name: 'Shop2', floor: 1, unitType: 0},
    {name: 'CommonA', floor: 2, unitType: 1}
  ];

  it('create an instance', () => {
    const pipe = new FilterUnitsShowingPipe();
    expect(pipe).toBeTruthy();
  });

  it('set empty data', () => {
    const pipe = new FilterUnitsShowingPipe();
    expect(pipe.transform(null, null)).toEqual([]);
    expect(pipe.transform([], null)).toEqual([]);
    expect(pipe.transform(null, UnitFilter.AllUnits)).toEqual([]);
    expect(pipe.transform([], UnitFilter.AllUnits)).toEqual([]);
  });

  it('set AllUnits filter', () => {
    const pipe = new FilterUnitsShowingPipe();
    expect(pipe.transform(data, UnitFilter.AllUnits)).toEqual([
      {name: 'Shop2', floor: 1, unitType: 0},
      {name: 'CommonA', floor: 2, unitType: 1}
    ]);
  });

  it('set AllShops filter', () => {
    const pipe = new FilterUnitsShowingPipe();
    expect(pipe.transform(data, UnitFilter.AllShops)).toEqual([
      {name: 'Shop2', floor: 1, unitType: 0}
    ]);
  });

  it('set AllCommonAreas filter', () => {
    const pipe = new FilterUnitsShowingPipe();
    expect(pipe.transform(data, UnitFilter.AllCommonAreas)).toEqual([
      {name: 'CommonA', floor: 2, unitType: 1}
    ]);
  });


});
