import {SortUnitsPipe} from './sort-units.pipe';
import {ShopOrder, ShopViewModel} from '@models';

describe('SortUnitsPipe', () => {
  const data = [
    {name: 'Shop2', floor: 1, tenant: {name: 'tenant 1'}},
    {name: 'Shop1', floor: 2, tenant: {name: 'tenant 2'}}
  ];

  it('create an instance', () => {
    const pipe = new SortUnitsPipe();
    expect(pipe).toBeTruthy();
  });

  it('set empty data', () => {
    const pipe = new SortUnitsPipe();
    expect(pipe.transform(null, null)).toEqual([]);
    expect(pipe.transform(null, 1)).toEqual([]);
    expect(pipe.transform([], 1)).toEqual([]);
  });

  it('sort by name', () => {
    const pipe = new SortUnitsPipe();
    expect(pipe.transform(data as ShopViewModel[], ShopOrder.ShopNameAsc)).toEqual([
      {name: 'Shop1', floor: 2, tenant: {name: 'tenant 2'}},
      {name: 'Shop2', floor: 1, tenant: {name: 'tenant 1'}}

    ]);
    expect(pipe.transform(data as ShopViewModel[], ShopOrder.ShopNameDesc)).toEqual([
      {name: 'Shop2', floor: 1, tenant: {name: 'tenant 1'}},
      {name: 'Shop1', floor: 2, tenant: {name: 'tenant 2'}}
    ]);
  });

  it('sort by floor', () => {
    const pipe = new SortUnitsPipe();
    expect(pipe.transform(data as ShopViewModel[], ShopOrder.FloorAsc)).toEqual([
      {name: 'Shop2', floor: 1, tenant: {name: 'tenant 1'}},
      {name: 'Shop1', floor: 2, tenant: {name: 'tenant 2'}}
    ]);
    expect(pipe.transform(data as ShopViewModel[], ShopOrder.FloorDesc)).toEqual([
      {name: 'Shop1', floor: 2, tenant: {name: 'tenant 2'}},
      {name: 'Shop2', floor: 1, tenant: {name: 'tenant 1'}}
    ]);
  });

  it('sort by tenant', () => {
    const pipe = new SortUnitsPipe();
    expect(pipe.transform(data as ShopViewModel[], ShopOrder.TenantNameAsc)).toEqual([
      {name: 'Shop2', floor: 1, tenant: {name: 'tenant 1'}},
      {name: 'Shop1', floor: 2, tenant: {name: 'tenant 2'}}
    ]);
    expect(pipe.transform(data as ShopViewModel[], ShopOrder.TenantNameDesc)).toEqual([
      {name: 'Shop1', floor: 2, tenant: {name: 'tenant 2'}},
      {name: 'Shop2', floor: 1, tenant: {name: 'tenant 1'}}
    ]);
  });
});
